import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

export type SummaryCardProps = {
  icon: 'book.fill' | 'eye.fill' | 'heart.fill' | 'doc.text';
  label: string;
  value: string;
  accentColor?: string;
};

export function SummaryCard({ icon, label, value, accentColor = '#0A7EA4' }: SummaryCardProps) {
  return (
	<View style={styles.card}>
	  <View style={[styles.iconWrap, { backgroundColor: `${accentColor}1A` }]}>
		<IconSymbol name={icon} size={20} color={accentColor} />
	  </View>
	  <Text style={styles.value}>{value}</Text>
	  <Text style={styles.label}>{label}</Text>
	</View>
  );
}

const styles = StyleSheet.create({
  card: {
	flex: 1,
	borderRadius: 20,
	padding: 16,
	backgroundColor: '#FFFFFF',
	borderWidth: 1,
	borderColor: '#EEF2F7',
	shadowColor: '#000',
	shadowOpacity: 0.05,
	shadowRadius: 10,
	shadowOffset: { width: 0, height: 6 },
	elevation: 2,
  },
  iconWrap: {
	width: 38,
	height: 38,
	borderRadius: 19,
	alignItems: 'center',
	justifyContent: 'center',
	marginBottom: 12,
  },
  value: {
	fontSize: 22,
	fontWeight: '800',
	color: '#111827',
  },
  label: {
	marginTop: 4,
	fontSize: 13,
	color: '#6B7280',
	fontWeight: '600',
  },
});

