import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { DocumentCard } from '@/components/dashboard/document-card';
import { SectionHeader } from '@/components/dashboard/section-header';
import { SummaryCardProps } from '@/components/dashboard/summary-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import {
    fetchDashboardData,
    getRecordLabel,
    type DocumentRecord,
    type SubjectRecord,
    type YearRecord,
} from '@/lib/api';


type DashboardState = {
    documents: DocumentRecord[];
    subjects: SubjectRecord[];
    years: YearRecord[];
};

const EMPTY_STATE: DashboardState = {
    documents: [],
    subjects: [],
    years: [],
};

export default function DashboardScreen() {
    const palette = Colors.dark || {
        text: '#FFFFFF',
        icon: '#94A3B8',
        tint: '#8B5CF6',
    };

    const [data, setData] = useState<DashboardState>(EMPTY_STATE);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const loadData = useCallback(async (showLoading = false) => {
        try {
            setError(null);

            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const nextData = await fetchDashboardData();
            setData(nextData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load dashboard data.',
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadData(true);
    }, [loadData]);

    const subjectMap = useMemo(() => {
        return new Map(
            data.subjects.map((subject) => [
                String(subject.id),
                getRecordLabel(subject, 'Subject'),
            ]),
        );
    }, [data.subjects]);

    const yearMap = useMemo(() => {
        return new Map(
            data.years.map((year) => [
                String(year.id),
                getRecordLabel(year, 'Year'),
            ]),
        );
    }, [data.years]);

    const filteredDocuments = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return data.documents.filter((doc) => {
            if (!query) return true;

            const subjectLabel =
                subjectMap.get(String(doc.subject_id ?? '')) ?? '';

            const yearLabel =
                yearMap.get(String(doc.year_id ?? '')) ?? '';

            const haystack = [
                doc.title,
                doc.description,
                subjectLabel,
                yearLabel,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return haystack.includes(query);
        });
    }, [data.documents, searchQuery, subjectMap, yearMap]);

    const recentDocuments = filteredDocuments.slice(0, 6);

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 18
                ? 'Good afternoon'
                : 'Good evening';

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => void loadData(false)}
                    tintColor={palette.tint}
                />
            }
        >
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.brand}>Bonnalai</Text>
                    <Text style={styles.brandSub}>
                        Smart academic repository
                    </Text>
                </View>

            </View>

            {/* HERO CARD */}
            <View style={styles.heroCard}>
                <View style={styles.heroGlow} />

                <Text style={styles.heroBadge}>Dashboard</Text>

                <Text style={styles.heroTitle}>
                    {greeting}, GIC-er 👋
                </Text>

                <Text style={styles.heroDescription}>
                    Browse documents, discover academic resources,
                    and keep track of your study materials in one place.
                </Text>
            </View>

            {/* SEARCH */}
            <View style={styles.searchBar}>
                <IconSymbol
                    name="magnifyingglass"
                    size={20}
                    color="#94A3B8"
                />

                <TextInput
                    placeholder="Search documents..."
                    placeholderTextColor="#64748B"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* ERROR */}
            {error ? (
                <View style={styles.errorCard}>
                    <Text style={styles.errorTitle}>
                        Connection Error
                    </Text>

                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            ) : null}

            {/* SECTION */}
            <SectionHeader
                title="Latest Documents"
                actionLabel="Refresh"
                onPressAction={() => void loadData(false)}
                style={{ color: 'white' }}
            />

            {/* LOADING */}
            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator
                        size="large"
                        color={palette.tint}
                    />

                    <Text style={styles.loadingText}>
                        Loading documents...
                    </Text>
                </View>
            ) : recentDocuments.length ? (
                <View style={styles.documentList}>
                    {recentDocuments.map((document) => (
                        <DocumentCard
                            key={String(
                                document.id ??
                                document.title ??
                                document.file_url,
                            )}
                            document={document}
                            subjectLabel={
                                document.subject_id !== undefined
                                    ? subjectMap.get(
                                        String(document.subject_id),
                                    )
                                    : undefined
                            }
                            yearLabel={
                                document.year_id !== undefined
                                    ? yearMap.get(
                                        String(document.year_id),
                                    )
                                    : undefined
                            }
                        />
                    ))}
                </View>
            ) : (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyEmoji}>📂</Text>

                    <Text style={styles.emptyTitle}>
                        No documents found
                    </Text>

                    <Text style={styles.emptyText}>
                        Try changing your search or refresh the page.
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#020617',
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 120,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
    },

    brand: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1.5,
    },

    brandSub: {
        marginTop: 4,
        fontSize: 13,
        color: '#64748B',
    },

    profileBubble: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },

    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#10B981',
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
        top: -40,
        right: -20,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: 'rgba(139,92,246,0.15)',
    },

    heroBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.06)',
        color: '#C4B5FD',
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
        marginTop: 24,
        gap: 12,
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
        marginBottom: 26,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
    },

    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#FFFFFF',
    },

    statsScroll: {
        paddingBottom: 10,
        gap: 14,
    },

    statsCard: {
        width: 170,
    },

    errorCard: {
        padding: 16,
        borderRadius: 20,
        marginBottom: 20,
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

    loadingWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },

    loadingText: {
        marginTop: 14,
        color: '#64748B',
        fontSize: 14,
    },

    documentList: {
        marginTop: 14,
        gap: 18,
    },

    emptyCard: {
        marginTop: 20,
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
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 20,
    },
});