// frontend/src/components/AdminComponents/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { Users, MessageSquare, Layers, BookOpen } from 'lucide-react';
import chatService from '../../services/chatService';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';


type KbRow = {
  kbId: string | number;
  title: string;
  questionPattern?: string;
  answer?: string;
  isPublished: boolean;
  category?: { id?: any; categoryName?: string; name?: string } | null;
  department?: { departmentId?: any; deptName?: string; name?: string } | null;
  createdAt?: any;
  updatedAt?: any;
};

type AdminUser = {
  fname?: string;
  lname?: string;
  role?: string;
  departmentName?: string;
  [key: string]: any;
};

type StatCard = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
};

const AdminDashboard = () => {
const [conversations, setConversations] = useState<number | null>(null);
const [categoriesCount, setCategoriesCount] = useState<number | null>(null);
const [usersCount, setUsersCount] = useState<number | null>(null);

const [kbTotal, setKbTotal] = useState<number | null>(null);
const [kbPublished, setKbPublished] = useState<number | null>(null);
const [kbDraft, setKbDraft] = useState<number | null>(null);
const [kbRecent, setKbRecent] = useState<KbRow[]>([]);

const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // ---------- helpers ----------
const formatDate = (value: any) => {
    const raw =
      value?.createdAt ||
      value?.created_at ||
      value?.updatedAt ||
      value?.updated_at ||
      value; // allow passing a plain date string

    if (!raw) return 'Unknown date';

    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return 'Unknown date';

    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

const normalizeKbRow = (row: any): KbRow => ({
    kbId: row.kbId ?? row.kb_id ?? row.id,
    title: row.title ?? '',
    questionPattern: row.questionPattern ?? row.question_pattern ?? '',
    answer: row.answer ?? '',
    isPublished: row.isPublished ?? row.is_published ?? false,
    category:
      row.category ||
      (row.category_id
        ? {
            id: row.category_id,
            categoryName: row.categoryName || row.category_name,
          }
        : null),
    department:
      row.department ||
      (row.department_id
        ? {
            departmentId: row.department_id,
            deptName: row.departmentName || row.department_name,
          }
        : null),
    createdAt: row.createdAt || row.created_at || null,
    updatedAt: row.updatedAt || row.updated_at || null,
  });

  // ---------- effect ----------
  useEffect(() => {
    let mounted = true;

    // who is logged in
    try {
      const raw = localStorage.getItem('adminUser');
      if (raw) setAdminUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }

    // categories
    chatService
      .getCategories()
      .then((cats) => {
        if (!mounted) return;
        setCategoriesCount(Array.isArray(cats) ? cats.length : 0);
      })
      .catch(() => mounted && setCategoriesCount(0));

    // conversations (unique sessions)
    chatService
      .getChatHistory()
      .then((msgs) => {
        if (!mounted) return;
        if (!Array.isArray(msgs)) {
          setConversations(0);
          return;
        }
        const sessionIds = new Set();
        msgs.forEach((m) => {
          if (m?.session?.sessionId != null) {
            sessionIds.add(m.session.sessionId);
          } else if (m?.sessionId != null) {
            sessionIds.add(m.sessionId);
          }
        });
        setConversations(sessionIds.size);
      })
      .catch(() => mounted && setConversations(0));

    // admin users
    axios
      .get(`${API_BASE_URL}/users`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data;
        setUsersCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => mounted && setUsersCount(0));

    // knowledge base stats + recent items
    axios
      .get(`${API_BASE_URL}/kb`)
      .then((res) => {
        if (!mounted) return;

        let raw = res.data;
        if (Array.isArray(raw)) {
          // ok
        } else if (Array.isArray(raw?.content)) {
          raw = raw.content;
        } else if (Array.isArray(raw?.data)) {
          raw = raw.data;
        } else {
          raw = [];
        }

        const normalized = raw.map(normalizeKbRow);

        const total = normalized.length;
        const publishedCount = normalized.filter((k: KbRow) => !!k.isPublished).length;
        const draftCount = total - publishedCount;

        setKbTotal(total);
        setKbPublished(publishedCount);
        setKbDraft(draftCount);

        // sort by created/updated date desc
        const sorted = [...normalized].sort((a, b) => {
          const da = new Date(a.createdAt || a.updatedAt || 0).getTime();
          const db = new Date(b.createdAt || b.updatedAt || 0).getTime();
          return db - da;
        });

        setKbRecent(sorted.slice(0, 5));
      })
      .catch(() => {
        if (!mounted) return;
        setKbTotal(0);
        setKbPublished(0);
        setKbDraft(0);
        setKbRecent([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

const kbPublishedRatio =
  kbTotal && kbTotal > 0
    ? Math.round(((kbPublished ?? 0) / kbTotal) * 100)
    : 0;

const stats: StatCard[] = [
    {
      title: 'Total Conversations',
      value: conversations == null ? '…' : conversations,
      subtitle: '+0%',
      icon: MessageSquare,
      color: 'bg-red-100',
      textColor: 'text-red-700',
    },
    {
      title: 'Knowledge Base Articles',
      value: kbTotal == null ? '…' : kbTotal,
      subtitle:
        kbTotal == null
          ? ''
          : `${kbPublished ?? 0} published, ${kbDraft ?? 0} draft`,
      icon: BookOpen,
      color: 'bg-amber-100',
      textColor: 'text-amber-700',
    },
    {
      title: 'Categories',
      value: categoriesCount == null ? '…' : categoriesCount,
      subtitle: '',
      icon: Layers,
      color: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      title: 'Admin Users',
      value: usersCount == null ? '…' : usersCount,
      subtitle:
        kbTotal && kbTotal > 0 ? `KB Published: ${kbPublishedRatio}%` : '',
      icon: Users,
      color: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-sm text-green-600 mt-2">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-4 rounded-lg`}>
                  <Icon size={24} className={stat.textColor} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent KB Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Recent Knowledge Base Activity
          </h2>

          {kbRecent.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No knowledge base activity yet.
            </div>
          ) : (
            <div className="space-y-4">
              {kbRecent.map((kb) => (
                <div
                  key={kb.kbId}
                  className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                      📝
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{kb.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Category:{' '}
                        <span className="font-medium">
                          {kb.category?.categoryName || kb.category?.name || '—'}
                        </span>{' '}
                        · Dept:{' '}
                        <span className="font-medium">
                          {kb.department?.deptName || kb.department?.name || '—'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Q:{' '}
                        {(kb.questionPattern || '')
                          .toString()
                          .slice(0, 80)}
                        {kb.questionPattern &&
                          kb.questionPattern.length > 80 &&
                          '…'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {formatDate({
                        createdAt: kb.createdAt,
                        updatedAt: kb.updatedAt,
                      })}
                    </p>
                    <span
                      className={`mt-1 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        kb.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {kb.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-gray-600">KB Published Ratio</span>
              <span className="text-gray-900 font-medium">
                {kbPublishedRatio}%
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-gray-600">Categories</span>
              <span className="text-gray-900 font-medium">
                {categoriesCount ?? 0}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-gray-600">Admin Users</span>
              <span className="text-gray-900 font-medium">
                {usersCount ?? 0}
              </span>
            </div>

            {adminUser && (
              <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                Logged in as{' '}
                <span className="font-medium">
                  {adminUser.fname} {adminUser.lname}
                </span>{' '}
                ({adminUser.role}
                {adminUser.departmentName
                  ? ` · Dept: ${adminUser.departmentName}`
                  : ''}
                )
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
