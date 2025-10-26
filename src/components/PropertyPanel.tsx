import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/stores/themeStore';
import { colors } from '@/design/colors';
import { typography } from '@/design/typography';
import { spacing } from '@/design/spacing';
import { TextInput } from './TextInput';
import { Slider } from './Slider';
import { Switch } from './Switch';
import { ColorPicker } from './ColorPicker';
import { Divider } from './Divider';

export interface PropertyField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'slider' | 'switch' | 'color' | 'custom';
  value: any;
  onChange: (value: any) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  customRenderer?: () => React.ReactNode;
}

interface PropertyPanelProps {
  title: string;
  fields: PropertyField[];
  onClose?: () => void;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  title,
  fields,
  onClose,
}) => {
  const { theme } = useTheme();

  const renderField = (field: PropertyField) => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            key={field.id}
            label={field.label}
            value={field.value}
            onChangeText={field.onChange}
            disabled={field.disabled}
          />
        );

      case 'number':
        return (
          <TextInput
            key={field.id}
            label={field.label}
            value={field.value.toString()}
            onChangeText={(text) => {
              const num = parseFloat(text);
              if (!isNaN(num)) {
                field.onChange(num);
              }
            }}
            keyboardType="numeric"
            disabled={field.disabled}
          />
        );

      case 'slider':
        return (
          <Slider
            key={field.id}
            label={field.label}
            value={field.value}
            onValueChange={field.onChange}
            minimumValue={field.min ?? 0}
            maximumValue={field.max ?? 100}
            step={field.step ?? 1}
            showValue
            disabled={field.disabled}
          />
        );

      case 'switch':
        return (
          <Switch
            key={field.id}
            label={field.label}
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          />
        );

      case 'color':
        return (
          <View key={field.id} style={styles.colorField}>
            <Text style={[styles.fieldLabel, { color: colors.text[theme] }]}>
              {field.label}
            </Text>
            <ColorPicker value={field.value} onChange={field.onChange} />
          </View>
        );

      case 'custom':
        return (
          <View key={field.id} style={styles.customField}>
            {field.customRenderer?.()}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface[theme] }]}>
      <View style={[styles.header, { borderBottomColor: colors.border[theme] }]}>
        <Text style={[styles.title, { color: colors.text[theme] }]}>
          {title}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {fields.map((field, index) => (
          <View key={field.id}>
            {renderField(field)}
            {index < fields.length - 1 && <Divider spacing="medium" />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    maxHeight: '80%',
    borderRadius: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    ...typography.title3,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  colorField: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.caption1,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  customField: {
    marginBottom: spacing.md,
  },
});
