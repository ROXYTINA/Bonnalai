import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { DocumentCard } from '@/components/dashboard/document-card';
import { SectionHeader } from '@/components/dashboard/section-header';
import { SummaryCard } from '@/components/dashboard/summary-card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

import {
  fetchDocuments,
  fetchSubjects,
  fetchYears,
  getRecordLabel,
  type DocumentRecord,
  type SubjectRecord,
  type YearRecord,
} from '@/lib/api';

export default function OthersScreen() {
  const palette = Colors.dark || {
    text: '#FFFFFF',
    icon: '#94A3B8',
    tint: '#38BDF8',
  };

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [years, setYears] = useState<YearRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');

  const [filter, setFilter] = useState<
      'all' | 'missing-subject' | 'missing-year'
  >('all');

  const loadDocuments = useCallback(
      async (initial = false) => {
        try {
          setError(null);

          if (initial) {
            setLoading(true);
          } else {
            setRefreshing(true);
          }

          const [
            nextDocuments,
            nextSubjects,
            nextYears,
          ] = await Promise.all([
            fetchDocuments(),
            fetchSubjects(),
            fetchYears(),
          ]);

          setDocuments(nextDocuments);
          setSubjects(nextSubjects);
          setYears(nextYears);
        } catch (err) {
          setError(
              err instanceof Error
                  ? err.message
                  : 'Failed to load documents',
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [],
  );

  useEffect(() => {
    void loadDocuments(true);
  }, [loadDocuments]);

  const subjectMap = useMemo(
      () =>
          new Map(
              subjects.map((item) => [
                String(item.id),
                getRecordLabel(item, 'Subject'),
              ]),
          ),
      [subjects],
  );

  const yearMap = useMemo(
      () =>
          new Map(
              years.map((item) => [
                String(item.id),
                getRecordLabel(item, 'Year'),
              ]),
          ),
      [years],
  );

  const filteredDocuments = useMemo(() => {
    const normalizedQuery =
        query.trim().toLowerCase();

    return documents.filter((document) => {
      if (
          filter === 'missing-subject' &&
          document.subject_id !== undefined &&
          document.subject_id !== null
      ) {
        return false;
      }

      if (
          filter === 'missing-year' &&
          document.year_id !== undefined &&
          document.year_id !== null
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const subjectLabel =
          document.subject_id !== undefined
              ? subjectMap.get(
              String(document.subject_id),
          ) ?? ''
              : '';

      const yearLabel =
          document.year_id !== undefined
              ? yearMap.get(
              String(document.year_id),
          ) ?? ''
              : '';

      const haystack = [
        document.title,
        document.description,
        subjectLabel,
        yearLabel,
      ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [
    documents,
    filter,
    query,
    subjectMap,
    yearMap,
  ]);

  const uncategorizedBySubject = useMemo(
      () =>
          documents.filter(
              (document) =>
                  document.subject_id === undefined ||
                  document.subject_id === null,
          ).length,
      [documents],
  );

  const uncategorizedByYear = useMemo(
      () =>
          documents.filter(
              (document) =>
                  document.year_id === undefined ||
                  document.year_id === null,
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
            Loading documents...
          </Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <FlatList
            data={filteredDocuments}
            keyExtractor={(item, index) =>
                String(item.id ?? index)
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() =>
                      void loadDocuments(false)
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
                      Documents
                    </Text>

                    <Text style={styles.brandSub}>
                      Manage uploaded files and
                      metadata
                    </Text>
                  </View>

                </View>

                {/* HERO */}
                <View style={styles.heroCard}>
                  <View style={styles.heroGlow} />

                  <Text style={styles.heroBadge}>
                    Repository Overview
                  </Text>

                  <Text style={styles.heroTitle}>
                    Track uploaded files 📂
                  </Text>

                  <Text style={styles.heroDescription}>
                    Monitor all uploaded
                    documents and quickly detect
                    missing metadata.
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
                      placeholder="Search documents..."
                      placeholderTextColor="#64748B"
                  />
                </View>

                {/* FILTERS */}
                <View style={styles.filterRow}>
                  <TouchableOpacity
                      onPress={() =>
                          setFilter('all')
                      }
                      style={[
                        styles.filterChip,
                        filter === 'all' &&
                        styles.filterChipActive,
                      ]}
                  >
                    <Text
                        style={[
                          styles.filterText,
                          filter === 'all' &&
                          styles.filterTextActive,
                        ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      onPress={() =>
                          setFilter(
                              'missing-subject',
                          )
                      }
                      style={[
                        styles.filterChip,
                        filter ===
                        'missing-subject' &&
                        styles.filterChipActive,
                      ]}
                  >
                    <Text
                        style={[
                          styles.filterText,
                          filter ===
                          'missing-subject' &&
                          styles.filterTextActive,
                        ]}
                    >
                      Missing Subject
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      onPress={() =>
                          setFilter(
                              'missing-year',
                          )
                      }
                      style={[
                        styles.filterChip,
                        filter ===
                        'missing-year' &&
                        styles.filterChipActive,
                      ]}
                  >
                    <Text
                        style={[
                          styles.filterText,
                          filter ===
                          'missing-year' &&
                          styles.filterTextActive,
                        ]}
                    >
                      Missing Year
                    </Text>
                  </TouchableOpacity>
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
                    title="Document List"
                    actionLabel="Reload"
                    onPressAction={() =>
                        void loadDocuments(false)
                    }
                    style={{
                      color: '#FFFFFF',
                    }}
                />
              </>
            }
            renderItem={({ item }) => (
                <View
                    style={styles.documentWrap}
                >
                  <DocumentCard
                      document={item}
                      subjectLabel={
                        item.subject_id !==
                        undefined
                            ? subjectMap.get(
                                String(
                                    item.subject_id,
                                ),
                            )
                            : undefined
                      }
                      yearLabel={
                        item.year_id !== undefined
                            ? yearMap.get(
                                String(
                                    item.year_id,
                                ),
                            )
                            : undefined
                      }
                  />
                </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <Text
                    style={styles.emptyEmoji}
                >
                  📭
                </Text>

                <Text
                    style={styles.emptyTitle}
                >
                  No documents found
                </Text>

                <Text
                    style={styles.emptyText}
                >
                  Try changing your search or
                  filters.
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
    backgroundColor: 'rgba(56,189,248,0.15)',
  },

  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#38BDF8',
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
    marginBottom: 18,
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

  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  filterChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },

  filterText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },

  filterTextActive: {
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

  documentWrap: {
    marginBottom: 18,
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