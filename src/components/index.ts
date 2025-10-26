/**
 * Component Library Exports
 * Comprehensive UI component collection for RoomDraft
 */

// Foundation Components (Phase 1)
export { Button } from './Button';
export { Card } from './Card';
export { AnimatedIcon } from './AnimatedIcon';
export { ProgressBar } from './ProgressBar';

// Input Components (Phase 2)
export { TextInput } from './TextInput';
export { SearchBar } from './SearchBar';
export { Checkbox } from './Checkbox';
export { Switch } from './Switch';
export { Slider } from './Slider';

// Feedback Components (Phase 2)
export { Modal } from './Modal';
export { BottomSheet } from './BottomSheet';
export { Toast, ToastProvider, useToast } from './Toast';
export type { ToastType } from './Toast';

// Display Components (Phase 2)
export { Badge } from './Badge';
export { Chip } from './Chip';
export { Avatar } from './Avatar';
export { Divider } from './Divider';
export { ListItem } from './ListItem';
export { Fab } from './Fab';
export { Spinner } from './Spinner';

// Navigation Components (Phase 2)
export { TabBar } from './TabBar';
export type { Tab } from './TabBar';
export { SegmentedControl } from './SegmentedControl';

// Layout Components (Phase 2)
export { Container } from './Container';
export { Stack } from './Stack';

// Editor Components (Phase 2)
export { Toolbar } from './Toolbar';
export type { ToolbarItem } from './Toolbar';
export { ColorPicker, PRESET_COLORS } from './ColorPicker';
export { PropertyPanel } from './PropertyPanel';
export type { PropertyField } from './PropertyPanel';
export { LayerPanel } from './LayerPanel';
export type { Layer } from './LayerPanel';

// Total: 29 production-ready components
// All components implement:
// - TypeScript props with proper types
// - Gesture handling with react-native-gesture-handler
// - Animations with Reanimated 3
// - Theme support (light/dark mode)
// - Accessibility support (VoiceOver, Dynamic Type)
// - iOS design patterns
