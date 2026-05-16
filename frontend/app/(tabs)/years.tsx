import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

import { SectionHeader } from '@/components/dashboard/section-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

import {
	fetchDocuments,
	fetchYears,
	getRecordLabel,
	type DocumentRecord,
	type YearRecord,
} from '@/lib/api';

export default function YearsScreen() {
	const palette = Colors.dark || {
		text: '#FFFFFF',
		icon: '#94A3B8',
		tint: '#F59E0B',
	};

	const [years, setYears] = useState<YearRecord[]>([]);
	const [documents, setDocuments] = useState<DocumentRecord[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState('');

	const loadYears = useCallback(async (initial = false) => {
		try {
			setError(null);

			if (initial) {
				setLoading(true);
			} else {
				setRefreshing(true);
			}

			const [nextYears, nextDocuments] =
				await Promise.all([
					fetchYears(),
					fetchDocuments(),
				]);

			setYears(nextYears);
			setDocuments(nextDocuments);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Failed to load years',
			);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	}, []);

	useEffect(() => {
		void loadYears(true);
	}, [loadYears]);

	const documentCountByYear = useMemo(() => {
		const map = new Map<string, number>();

		for (const document of documents) {
			const key = String(document.year_id ?? '');

			if (!key) continue;

			map.set(key, (map.get(key) ?? 0) + 1);
		}

		return map;
	}, [documents]);

	const filteredYears = useMemo(() => {
		const normalizedQuery =
			query.trim().toLowerCase();

		return years.filter((year) => {
			if (!normalizedQuery) return true;

			const label = getRecordLabel(
				year,
				'Year',
			).toLowerCase();

			return (
				label.includes(normalizedQuery) ||
				String(year.id ?? '').includes(
					normalizedQuery,
				)
			);
		});
	}, [query, years]);

	const mappedDocumentsCount = useMemo(
		() =>
			documents.filter(
				(document) =>
					document.year_id !== undefined &&
					document.year_id !== null,
			).length,
		[documents],
	);

	if (loading) {
		return (
			<View style={styles.loadingScreen}>
				<ActivityIndicator
					size="large"
					color={palette.tint}
				/>

				<Text style={styles.loadingText}>
					Loading academic years...
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={filteredYears}
				keyExtractor={(item, index) =>
					String(item.id ?? index)
				}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={() =>
							void loadYears(false)
						}
						tintColor={palette.tint}
					/>
				}
				contentContainerStyle={styles.content}
				ListHeaderComponent={
					<>
						{/* HEADER */}
						<View style={styles.header}>
							<View>
								<Text style={styles.brand}>
									Academic Years
								</Text>

								<Text style={styles.brandSub}>
									Explore year groups and
									records
								</Text>
							</View>

						</View>

						{/* HERO */}
						<View style={styles.heroCard}>
							<View style={styles.heroGlow} />

							<Text style={styles.heroBadge}>
								Timeline Overview
							</Text>

							<Text style={styles.heroTitle}>
								Organize academic progress 🎓
							</Text>

							<Text style={styles.heroDescription}>
								Manage year groups and
								discover documents linked to
								each academic level.
							</Text>

						</View>

						{/* SEARCH */}
						<View style={styles.searchBar}>
							<IconSymbol
								name="magnifyingglass"
								size={18}
								color="#94A3B8"
							/>

							<TextInput
								style={styles.searchInput}
								value={query}
								onChangeText={setQuery}
								placeholder="Search academic years..."
								placeholderTextColor="#64748B"
							/>
						</View>

						{/* ERROR */}
						{error ? (
							<View style={styles.errorCard}>
								<Text
									style={
										styles.errorTitle
									}
								>
									Connection Error
								</Text>

								<Text
									style={styles.errorText}
								>
									{error}
								</Text>
							</View>
						) : null}


						{/* SECTION */}
						<SectionHeader
							title="Year List"
							actionLabel="Reload"
							onPressAction={() =>
								void loadYears(false)
							}
							style={{
								color: '#FFFFFF',
							}}
						/>
					</>
				}
				renderItem={({ item }) => (
					<View style={styles.yearCard}>
						<View
							style={
								styles.yearCardHeader
							}
						>
							<View
								style={
									styles.yearIconWrap
								}
							>
								<IconSymbol
									name="calendar"
									size={18}
									color="#FBBF24"
								/>
							</View>

							<View style={{ flex: 1 }}>
								<Text
									style={
										styles.yearTitle
									}
								>
									{getRecordLabel(
										item,
										'Year',
									)}
								</Text>

								<Text
									style={
										styles.yearMeta
									}
								>
									Year ID:{' '}
									{item.id ?? '-'}
								</Text>
							</View>
						</View>

						<View
							style={styles.yearFooter}
						>
							<View
								style={
									styles.countBadge
								}
							>
								<Text
									style={
										styles.countBadgeText
									}
								>
									{
										documentCountByYear.get(
											String(
												item.id ??
												'',
											),
										) ?? 0
									}{' '}
									Docs
								</Text>
							</View>
						</View>
					</View>
				)}
				ListEmptyComponent={
					<View style={styles.emptyCard}>
						<Text
							style={styles.emptyEmoji}
						>
							🎓
						</Text>

						<Text
							style={styles.emptyTitle}
						>
							No academic years found
						</Text>

						<Text
							style={styles.emptyText}
						>
							Try searching with a different
							keyword.
						</Text>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#020617',
	},

	content: {
		paddingHorizontal: 20,
		paddingTop: 60,
		paddingBottom: 120,
	},

	loadingScreen: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#020617',
	},

	loadingText: {
		marginTop: 14,
		color: '#94A3B8',
		fontSize: 14,
	},

	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 26,
	},

	brand: {
		fontSize: 30,
		fontWeight: '900',
		color: '#FFFFFF',
		letterSpacing: -1.5,
	},

	brandSub: {
		marginTop: 4,
		fontSize: 13,
		color: '#64748B',
	},

	headerBadge: {
		width: 46,
		height: 46,
		borderRadius: 23,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#111827',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
	},

	heroCard: {
		position: 'relative',
		overflow: 'hidden',
		borderRadius: 30,
		padding: 24,
		marginBottom: 24,
		backgroundColor: '#111827',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
	},

	heroGlow: {
		position: 'absolute',
		top: -50,
		right: -20,
		width: 180,
		height: 180,
		borderRadius: 90,
		backgroundColor: 'rgba(245,158,11,0.15)',
	},

	heroBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,255,0.06)',
		color: '#FBBF24',
		fontSize: 12,
		fontWeight: '700',
		marginBottom: 16,
	},

	heroTitle: {
		fontSize: 28,
		fontWeight: '800',
		color: '#FFFFFF',
		lineHeight: 34,
	},

	heroDescription: {
		marginTop: 10,
		fontSize: 15,
		lineHeight: 22,
		color: '#94A3B8',
	},

	heroStatsRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 24,
	},

	heroMiniCard: {
		flex: 1,
		padding: 14,
		borderRadius: 18,
		backgroundColor: 'rgba(255,255,255,0.05)',
	},

	heroMiniValue: {
		fontSize: 20,
		fontWeight: '800',
		color: '#FFFFFF',
	},

	heroMiniLabel: {
		marginTop: 4,
		fontSize: 12,
		color: '#94A3B8',
	},

	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 58,
		borderRadius: 20,
		paddingHorizontal: 18,
		marginBottom: 22,
		backgroundColor: 'rgba(255,255,255,0.05)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
	},

	searchInput: {
		flex: 1,
		marginLeft: 10,
		fontSize: 15,
		color: '#FFFFFF',
	},

	statsRow: {
		flexDirection: 'row',
		gap: 14,
		marginBottom: 26,
	},

	statsCard: {
		flex: 1,
	},

	errorCard: {
		padding: 16,
		borderRadius: 20,
		marginBottom: 18,
		backgroundColor: 'rgba(239,68,68,0.12)',
		borderWidth: 1,
		borderColor: 'rgba(239,68,68,0.2)',
	},

	errorTitle: {
		fontSize: 15,
		fontWeight: '700',
		color: '#FCA5A5',
	},

	errorText: {
		marginTop: 6,
		color: '#F87171',
		lineHeight: 20,
	},

	yearCard: {
		padding: 18,
		borderRadius: 24,
		marginBottom: 16,
		backgroundColor: '#111827',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
	},

	yearCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	yearIconWrap: {
		width: 50,
		height: 50,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(245,158,11,0.14)',
		marginRight: 14,
	},

	yearTitle: {
		fontSize: 17,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	yearMeta: {
		marginTop: 4,
		fontSize: 13,
		color: '#94A3B8',
	},

	yearFooter: {
		marginTop: 18,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},

	countBadge: {
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderRadius: 999,
		backgroundColor: 'rgba(56,189,248,0.12)',
	},

	countBadgeText: {
		color: '#38BDF8',
		fontSize: 12,
		fontWeight: '700',
	},

	emptyCard: {
		marginTop: 24,
		padding: 30,
		borderRadius: 28,
		alignItems: 'center',
		backgroundColor: '#111827',
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.05)',
	},

	emptyEmoji: {
		fontSize: 42,
		marginBottom: 10,
	},

	emptyTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#FFFFFF',
	},

	emptyText: {
		marginTop: 8,
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
		color: '#94A3B8',
	},
});