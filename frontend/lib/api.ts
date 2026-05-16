import { Platform } from 'react-native';


export type BackendRecord = Record<string, any>;

export type DocumentRecord = {
  id?: number | string;
  title?: string;
  description?: string;
  subject_id?: number | string;
  year_id?: number | string;
  file_url?: string;
  [key: string]: any;
};

export type SubjectRecord = {
  id?: number | string;
  name?: string;
  title?: string;
  label?: string;
  [key: string]: any;
};

export type YearRecord = {
  id?: number | string;
  name?: string;
  title?: string;
  label?: string;
  year?: string | number;
  [key: string]: any;
};

export type DashboardResponse = {
  documents: DocumentRecord[];
  subjects: SubjectRecord[];
  years: YearRecord[];
};

const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL ?? 'http://localhost:3000';

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchDocuments() {
  return requestJson<DocumentRecord[]>('/documents');
}

export async function fetchSubjects() {
  return requestJson<SubjectRecord[]>('/subjects');
}

export async function fetchYears() {
  return requestJson<YearRecord[]>('/years');
}

export async function fetchDashboardData(): Promise<DashboardResponse> {
  const [documentsResult, subjectsResult, yearsResult] = await Promise.allSettled([
    fetchDocuments(),
    fetchSubjects(),
    fetchYears(),
  ]);

  return {
    documents: documentsResult.status === 'fulfilled' ? documentsResult.value : [],
    subjects: subjectsResult.status === 'fulfilled' ? subjectsResult.value : [],
    years: yearsResult.status === 'fulfilled' ? yearsResult.value : [],
  };
}

export async function uploadDocument(formData: FormData) {
  return requestJson<{ message?: string; document?: DocumentRecord }>('/documents/upload', {
    method: 'POST',
    body: formData,
  });
}

export function getRecordLabel(record: BackendRecord, fallbackPrefix: string) {
  return (
    record?.name ??
    record?.title ??
    record?.label ??
    record?.year ??
    `${fallbackPrefix} ${record?.id ?? ''}`.trim()
  );
}

