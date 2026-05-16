import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type EntityChipProps = {
  label: string;
  meta?: string;
  tint?: string;
};

export function EntityChip({ label, meta, tint = '#0A7EA4' }: EntityChipProps) {
  return (
	<View style={[styles.chip, { borderColor: `${tint}33`, backgroundColor: `${tint}0F` }]}>
	  <Text style={[styles.label, { color: tint }]} numberOfLines={1}>
		{label}
	  </Text>
	  {meta ? <Text style={styles.meta}>{meta}</Text> : null}
	</View>
  );
}

const styles = StyleSheet.create({
  chip: {
	minWidth: 110,
	borderRadius: 999,
	borderWidth: 1,
	paddingHorizontal: 14,
	paddingVertical: 10,
	marginRight: 10,
  },
  label: {
	fontSize: 13,
	fontWeight: '800',
  },
  meta: {
	marginTop: 2,
	fontSize: 11,
	color: '#6B7280',
	fontWeight: '600',
  },
});

