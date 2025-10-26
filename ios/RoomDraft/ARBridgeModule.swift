import Foundation
import ARKit
import RealityKit

@objc(ARBridgeModule)
class ARBridgeModule: RCTEventEmitter {

  private var arSession: ARSession?
  private var arView: ARView?
  private var isCapturing = false
  private var capturedPoints: [simd_float3] = []
  private var surfaceMeshes: [UUID: MeshAnchor] = [:]

  // MARK: - Lifecycle

  override init() {
    super.init()
    setupARSession()
  }

  deinit {
    cleanup()
  }

  // MARK: - Setup

  private func setupARSession() {
    arSession = ARSession()
    arSession?.delegate = self
  }

  // MARK: - RCTEventEmitter

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func supportedEvents() -> [String]! {
    return [
      "onARInitialized",
      "onARError",
      "onCaptureProgress",
      "onCaptureComplete",
      "onPlaneDetected",
      "onMeshUpdate"
    ]
  }

  // MARK: - JavaScript Methods

  @objc
  func initializeAR(_ config: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard ARWorldTrackingConfiguration.isSupported else {
      reject("AR_NOT_SUPPORTED", "ARKit is not supported on this device", nil)
      return
    }

    guard ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh) else {
      reject("LIDAR_NOT_SUPPORTED", "LiDAR is not supported on this device", nil)
      return
    }

    DispatchQueue.main.async { [weak self] in
      guard let self = self else { return }

      let configuration = ARWorldTrackingConfiguration()

      // Enable plane detection
      if let enablePlaneDetection = config["enablePlaneDetection"] as? Bool, enablePlaneDetection {
        configuration.planeDetection = [.horizontal, .vertical]
      }

      // Enable scene reconstruction (LiDAR)
      if let enableSceneReconstruction = config["enableSceneReconstruction"] as? Bool, enableSceneReconstruction {
        configuration.sceneReconstruction = .mesh
      }

      // Enable world tracking
      configuration.worldAlignment = .gravity

      // High accuracy frame semantics
      if ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth) {
        configuration.frameSemantics = [.sceneDepth, .smoothedSceneDepth]
      }

      // Run the session
      self.arSession?.run(configuration, options: [.resetTracking, .removeExistingAnchors])

      self.sendEvent(withName: "onARInitialized", body: [
        "success": true,
        "capabilities": self.getDeviceCapabilities()
      ])

      resolve([
        "success": true,
        "capabilities": self.getDeviceCapabilities()
      ])
    }
  }

  @objc
  func startCapture(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard let session = arSession else {
      reject("AR_NOT_INITIALIZED", "AR session not initialized", nil)
      return
    }

    isCapturing = true
    capturedPoints = []

    sendEvent(withName: "onCaptureProgress", body: [
      "status": "started",
      "pointCount": 0
    ])

    resolve(["status": "capturing"])
  }

  @objc
  func stopCapture(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

    isCapturing = false

    let pointsData = capturedPoints.map { point in
      return [
        "x": point.x,
        "y": point.y,
        "z": point.z
      ]
    }

    sendEvent(withName: "onCaptureComplete", body: [
      "pointCount": capturedPoints.count,
      "points": pointsData
    ])

    resolve([
      "pointCount": capturedPoints.count,
      "points": pointsData
    ])
  }

  @objc
  func getPointCloud(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard let frame = arSession?.currentFrame else {
      reject("NO_FRAME", "No AR frame available", nil)
      return
    }

    guard let depthData = frame.sceneDepth else {
      reject("NO_DEPTH_DATA", "No depth data available", nil)
      return
    }

    let depthMap = depthData.depthMap
    let confidenceMap = depthData.confidenceMap

    var points: [[String: Any]] = []
    var confidenceValues: [Float] = []

    let width = CVPixelBufferGetWidth(depthMap)
    let height = CVPixelBufferGetHeight(depthMap)

    CVPixelBufferLockBaseAddress(depthMap, .readOnly)
    CVPixelBufferLockBaseAddress(confidenceMap, .readOnly)

    defer {
      CVPixelBufferUnlockBaseAddress(depthMap, .readOnly)
      CVPixelBufferUnlockBaseAddress(confidenceMap, .readOnly)
    }

    let depthPointer = unsafeBitCast(CVPixelBufferGetBaseAddress(depthMap), to: UnsafeMutablePointer<Float32>.self)
    let confidencePointer = unsafeBitCast(CVPixelBufferGetBaseAddress(confidenceMap), to: UnsafeMutablePointer<UInt8>.self)

    // Sample every 10th pixel for performance
    for y in stride(from: 0, to: height, by: 10) {
      for x in stride(from: 0, to: width, by: 10) {
        let index = y * width + x
        let depth = depthPointer[index]
        let confidence = confidencePointer[index]

        // Only include high confidence points
        if confidence >= ARConfidenceLevel.medium.rawValue {
          // Convert pixel coordinates to world space
          let normalizedPoint = CGPoint(x: CGFloat(x) / CGFloat(width),
                                       y: CGFloat(y) / CGFloat(height))

          if let worldPoint = frame.worldPoint(for: normalizedPoint, depth: depth) {
            points.append([
              "x": worldPoint.x,
              "y": worldPoint.y,
              "z": worldPoint.z
            ])
            confidenceValues.append(Float(confidence) / 255.0)
          }
        }
      }
    }

    resolve([
      "points": points,
      "confidence": confidenceValues,
      "count": points.count
    ])
  }

  @objc
  func getMeshAnchors(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {

    guard let frame = arSession?.currentFrame else {
      reject("NO_FRAME", "No AR frame available", nil)
      return
    }

    var meshes: [[String: Any]] = []

    for anchor in frame.anchors {
      if let meshAnchor = anchor as? ARMeshAnchor {
        let geometry = meshAnchor.geometry

        // Extract vertices
        var vertices: [[String: Float]] = []
        for i in 0..<geometry.vertices.count {
          let vertex = geometry.vertices[i]
          vertices.append([
            "x": vertex.x,
            "y": vertex.y,
            "z": vertex.z
          ])
        }

        // Extract faces (triangles)
        var faces: [[Int]] = []
        let indexCount = geometry.faces.count * geometry.faces.indexCountPerPrimitive
        for i in stride(from: 0, to: indexCount, by: 3) {
          if i + 2 < indexCount {
            faces.append([
              Int(geometry.faces[i]),
              Int(geometry.faces[i + 1]),
              Int(geometry.faces[i + 2])
            ])
          }
        }

        meshes.append([
          "id": meshAnchor.identifier.uuidString,
          "vertices": vertices,
          "faces": faces,
          "transform": transformToArray(meshAnchor.transform)
        ])
      }
    }

    resolve([
      "meshes": meshes,
      "count": meshes.count
    ])
  }

  @objc
  func pauseSession(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    arSession?.pause()
    resolve(["status": "paused"])
  }

  @objc
  func resumeSession(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    arSession?.run(arSession?.configuration ?? ARWorldTrackingConfiguration())
    resolve(["status": "resumed"])
  }

  @objc
  func resetSession(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    capturedPoints = []
    surfaceMeshes = []
    arSession?.run(arSession?.configuration ?? ARWorldTrackingConfiguration(), options: [.resetTracking, .removeExistingAnchors])
    resolve(["status": "reset"])
  }

  // MARK: - Helpers

  private func getDeviceCapabilities() -> [String: Bool] {
    return [
      "supportsWorldTracking": ARWorldTrackingConfiguration.isSupported,
      "supportsSceneReconstruction": ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh),
      "supportsPlaneDetection": true,
      "supportsSceneDepth": ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth),
      "supportsLiDAR": ARWorldTrackingConfiguration.supportsSceneReconstruction(.mesh)
    ]
  }

  private func transformToArray(_ transform: simd_float4x4) -> [[Float]] {
    return [
      [transform.columns.0.x, transform.columns.0.y, transform.columns.0.z, transform.columns.0.w],
      [transform.columns.1.x, transform.columns.1.y, transform.columns.1.z, transform.columns.1.w],
      [transform.columns.2.x, transform.columns.2.y, transform.columns.2.z, transform.columns.2.w],
      [transform.columns.3.x, transform.columns.3.y, transform.columns.3.z, transform.columns.3.w]
    ]
  }

  private func cleanup() {
    arSession?.pause()
    arSession?.delegate = nil
    arSession = nil
    capturedPoints = []
    surfaceMeshes = []
  }
}

// MARK: - ARSessionDelegate

extension ARBridgeModule: ARSessionDelegate {

  func session(_ session: ARSession, didUpdate frame: ARFrame) {
    guard isCapturing else { return }

    // Capture point cloud data
    if let depthData = frame.sceneDepth {
      let depthMap = depthData.depthMap
      let confidenceMap = depthData.confidenceMap

      CVPixelBufferLockBaseAddress(depthMap, .readOnly)
      CVPixelBufferLockBaseAddress(confidenceMap, .readOnly)

      defer {
        CVPixelBufferUnlockBaseAddress(depthMap, .readOnly)
        CVPixelBufferUnlockBaseAddress(confidenceMap, .readOnly)
      }

      let width = CVPixelBufferGetWidth(depthMap)
      let height = CVPixelBufferGetHeight(depthMap)

      let depthPointer = unsafeBitCast(CVPixelBufferGetBaseAddress(depthMap), to: UnsafeMutablePointer<Float32>.self)
      let confidencePointer = unsafeBitCast(CVPixelBufferGetBaseAddress(confidenceMap), to: UnsafeMutablePointer<UInt8>.self)

      // Sample points and add to capture
      for y in stride(from: 0, to: height, by: 20) {
        for x in stride(from: 0, to: width, by: 20) {
          let index = y * width + x
          let confidence = confidencePointer[index]

          if confidence >= ARConfidenceLevel.high.rawValue {
            let depth = depthPointer[index]
            let normalizedPoint = CGPoint(x: CGFloat(x) / CGFloat(width),
                                         y: CGFloat(y) / CGFloat(height))

            if let worldPoint = frame.worldPoint(for: normalizedPoint, depth: depth) {
              capturedPoints.append(simd_float3(worldPoint.x, worldPoint.y, worldPoint.z))
            }
          }
        }
      }

      // Send progress update every 30 frames
      if capturedPoints.count % 30 == 0 {
        sendEvent(withName: "onCaptureProgress", body: [
          "pointCount": capturedPoints.count
        ])
      }
    }
  }

  func session(_ session: ARSession, didAdd anchors: [ARAnchor]) {
    for anchor in anchors {
      if let planeAnchor = anchor as? ARPlaneAnchor {
        sendEvent(withName: "onPlaneDetected", body: [
          "id": planeAnchor.identifier.uuidString,
          "alignment": planeAnchor.alignment == .horizontal ? "horizontal" : "vertical",
          "extent": [
            "width": planeAnchor.planeExtent.width,
            "height": planeAnchor.planeExtent.height
          ],
          "center": [
            "x": planeAnchor.center.x,
            "y": planeAnchor.center.y,
            "z": planeAnchor.center.z
          ]
        ])
      } else if let meshAnchor = anchor as? ARMeshAnchor {
        surfaceMeshes[meshAnchor.identifier] = meshAnchor

        sendEvent(withName: "onMeshUpdate", body: [
          "id": meshAnchor.identifier.uuidString,
          "vertexCount": meshAnchor.geometry.vertices.count,
          "faceCount": meshAnchor.geometry.faces.count
        ])
      }
    }
  }

  func session(_ session: ARSession, didUpdate anchors: [ARAnchor]) {
    for anchor in anchors {
      if let meshAnchor = anchor as? ARMeshAnchor {
        surfaceMeshes[meshAnchor.identifier] = meshAnchor

        sendEvent(withName: "onMeshUpdate", body: [
          "id": meshAnchor.identifier.uuidString,
          "vertexCount": meshAnchor.geometry.vertices.count,
          "faceCount": meshAnchor.geometry.faces.count
        ])
      }
    }
  }

  func session(_ session: ARSession, didFailWithError error: Error) {
    sendEvent(withName: "onARError", body: [
      "error": error.localizedDescription,
      "code": (error as NSError).code
    ])
  }

  func sessionWasInterrupted(_ session: ARSession) {
    sendEvent(withName: "onARError", body: [
      "error": "AR session was interrupted",
      "code": "SESSION_INTERRUPTED"
    ])
  }

  func sessionInterruptionEnded(_ session: ARSession) {
    // Restart session
    session.run(session.configuration ?? ARWorldTrackingConfiguration(), options: [.resetTracking])
  }
}

// MARK: - ARFrame Extension

extension ARFrame {
  func worldPoint(for point: CGPoint, depth: Float) -> simd_float3? {
    let width = Float(camera.imageResolution.width)
    let height = Float(camera.imageResolution.height)

    let x = (point.x * 2 - 1) * depth
    let y = (point.y * 2 - 1) * depth

    let viewPoint = simd_float4(Float(x), Float(y), -depth, 1)
    let worldPoint = camera.transform * viewPoint

    return simd_float3(worldPoint.x, worldPoint.y, worldPoint.z)
  }
}
