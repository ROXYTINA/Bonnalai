import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import type { DocumentRecord } from '@/lib/api';

export type DocumentCardProps = {
  document: DocumentRecord;
  subjectLabel?: string;
  yearLabel?: string;
};

export function DocumentCard({ document, subjectLabel, yearLabel }: DocumentCardProps) {
  const fileUrl = document.file_url;
  const description = document.description?.trim();

  const handleOpenFile = async () => {
	if (!fileUrl) {
	  return;
	}

	await Linking.openURL(fileUrl);
  };

  return (
	<View style={styles.card}>
	  <View style={styles.header}>
		<View style={styles.badge}>
		  <IconSymbol name="doc.text" size={18} color="#0A7EA4" />
		</View>
		<View style={styles.headerText}>
		  <Text style={styles.title} numberOfLines={1}>
			{document.title ?? 'Untitled document'}
		  </Text>
		  <Text style={styles.meta} numberOfLines={1}>
			{[subjectLabel, yearLabel].filter(Boolean).join(' • ') || 'No subject or year yet'}
		  </Text>
		</View>
	  </View>

	  {description ? (
		<Text style={styles.description} numberOfLines={3}>
		  {description}
		</Text>
	  ) : null}

	  <View style={styles.footer}>
		<Text style={styles.linkText} numberOfLines={1}>
		  {fileUrl ? 'Uploaded file available' : 'No file uploaded yet'}
		</Text>

		{fileUrl ? (
		  <Pressable onPress={handleOpenFile} style={styles.button}>
			<Text style={styles.buttonText}>Open</Text>
		  </Pressable>
		) : null}
	  </View>
	</View>
  );
}

const styles = StyleSheet.create({
  card: {
	borderRadius: 22,
	padding: 16,
	backgroundColor: '#FFFFFF',
	borderWidth: 1,
	borderColor: '#EEF2F7',
	marginBottom: 12,
	shadowColor: '#000',
	shadowOpacity: 0.05,
	shadowRadius: 10,
	shadowOffset: { width: 0, height: 6 },
	elevation: 2,
  },
  header: {
	flexDirection: 'row',
	alignItems: 'center',
  },
  badge: {
	width: 40,
	height: 40,
	borderRadius: 20,
	backgroundColor: '#F0F9FF',
	alignItems: 'center',
	justifyContent: 'center',
	marginRight: 12,
  },
  headerText: {
	flex: 1,
  },
  title: {
	fontSize: 16,
	fontWeight: '800',
	color: '#111827',
  },
  meta: {
	marginTop: 4,
	fontSize: 12,
	color: '#6B7280',
	fontWeight: '600',
  },
  description: {
	marginTop: 12,
	fontSize: 13,
	color: '#4B5563',
	lineHeight: 19,
  },
  footer: {
	marginTop: 14,
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 12,
  },
  linkText: {
	flex: 1,
	fontSize: 12,
	color: '#6B7280',
  },
  button: {
	paddingHorizontal: 14,
	paddingVertical: 10,
	borderRadius: 12,
	backgroundColor: '#0A7EA4',
  },
  buttonText: {
	color: '#FFFFFF',
	fontWeight: '700',
	fontSize: 12,
  },
});

