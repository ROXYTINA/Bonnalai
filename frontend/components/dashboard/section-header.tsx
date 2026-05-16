import React from 'react';
import {
	Pressable,
	StyleSheet,
	Text,
	TextStyle,
	View,
} from 'react-native';

type SectionHeaderProps = {
	title: string;
	actionLabel?: string;
	onPressAction?: () => void;
	style?: TextStyle;
};

export function SectionHeader({
								  title,
								  actionLabel,
								  onPressAction,
								  style,
							  }: SectionHeaderProps) {
	return (
		<View style={styles.container}>
			<Text style={[styles.title, style]}>
				{title}
			</Text>

			{actionLabel ? (
				<Pressable onPress={onPressAction}>
					<Text style={styles.action}>
						{actionLabel}
					</Text>
				</Pressable>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 16,
	},

	title: {
		fontSize: 20,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	action: {
		fontSize: 14,
		fontWeight: '600',
		color: '#8B5CF6',
	},
});