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
  fetchSubjects,
  getRecordLabel,
  type DocumentRecord,
  type SubjectRecord,
} from '@/lib/api';

export default function SubjectScreen() {
  const palette = Colors.dark || {
    text: '#FFFFFF',
    icon: '#94A3B8',
    tint: '#8B5CF6',
  };

  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const loadSubjects = useCallback(async (initial = false) => {
    try {
      setError(null);

      if (initial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [nextSubjects, nextDocuments] =
          await Promise.all([
            fetchSubjects(),
            fetchDocuments(),
          ]);

      setSubjects(nextSubjects);
      setDocuments(nextDocuments);
    } catch (err) {
      setError(
          err instanceof Error
              ? err.message
              : 'Failed to load subjects',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadSubjects(true);
  }, [loadSubjects]);

  const documentCountBySubject = useMemo(() => {
    const map = new Map<string, number>();

    for (const document of documents) {
      const key = String(document.subject_id ?? '');

      if (!key) continue;

      map.set(key, (map.get(key) ?? 0) + 1);
    }

    return map;
  }, [documents]);

  const filteredSubjects = useMemo(() => {
    const normalizedQuery =
        query.trim().toLowerCase();

    return subjects.filter((subject) => {
      if (!normalizedQuery) return true;

      const label = getRecordLabel(
          subject,
          'Subject',
      ).toLowerCase();

      return (
          label.includes(normalizedQuery) ||
          String(subject.id ?? '').includes(
              normalizedQuery,
          )
      );
    });
  }, [query, subjects]);

  const mappedDocumentsCount = useMemo(
      () =>
          documents.filter(
              (document) =>
                  document.subject_id !== undefined &&
                  document.subject_id !== null,
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
            Loading subjects...
          </Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <FlatList
            data={filteredSubjects}
            keyExtractor={(item, index) =>
                String(item.id ?? index)
            }
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() =>
                      void loadSubjects(false)
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
                      Subjects
                    </Text>

                    <Text style={styles.brandSub}>
                      Browse academic subjects
                    </Text>
                  </View>


                </View>

                {/* HERO */}
                <View style={styles.heroCard}>
                  <View style={styles.heroGlow} />

                  <Text style={styles.heroBadge}>
                    Academic Hub
                  </Text>

                  <Text style={styles.heroTitle}>
                    Organize your learning 📚
                  </Text>

                  <Text style={styles.heroDescription}>
                    Access all available subjects
                    and quickly discover related
                    documents.
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
                      placeholder="Search subjects..."
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
                    title="Subject List"
                    actionLabel="Reload"
                    onPressAction={() =>
                        void loadSubjects(false)
                    }
                    style={{
                      color: '#FFFFFF',
                    }}
                />
              </>
            }
            renderItem={({ item }) => (
                <View style={styles.subjectCard}>
                  <View
                      style={
                        styles.subjectCardHeader
                      }
                  >
                    <View
                        style={
                          styles.subjectIconWrap
                        }
                    >
                      <IconSymbol
                          name="book.fill"
                          size={18}
                          color="#C4B5FD"
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                          style={
                            styles.subjectTitle
                          }
                      >
                        {getRecordLabel(
                            item,
                            'Subject',
                        )}
                      </Text>

                      <Text
                          style={
                            styles.subjectMeta
                          }
                      >
                        Subject ID:{' '}
                        {item.id ?? '-'}
                      </Text>
                    </View>
                  </View>

                  <View
                      style={
                        styles.subjectFooter
                      }
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
                            documentCountBySubject.get(
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
                  📚
                </Text>

                <Text
                    style={styles.emptyTitle}
                >
                  No subjects found
                </Text>

                <Text
                    style={styles.emptyText}
                >
                  Try adjusting your search
                  query.
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
    backgroundColor: 'rgba(139,92,246,0.14)',
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

  subjectCard: {
    padding: 18,
    borderRadius: 24,
    marginBottom: 16,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  subjectCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  subjectIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139,92,246,0.12)',
    marginRight: 14,
  },

  subjectTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  subjectMeta: {
    marginTop: 4,
    fontSize: 13,
    color: '#94A3B8',
  },

  subjectFooter: {
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