import type {RouteRecordRaw} from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'HomePage',
                component: () => import('@/views/Home.vue'),
            },
            {
                path: 'department',
                name: 'Department',
                component: () => import('@/views/Department.vue'),
            },
            {
              path: 'year',
              name: 'Year',
              component: () => import('@/views/Year.vue'),
            },
            {
                path: 'subject',
                name: 'Subject',
                component: () => import('@/views/Subject.vue'),
            },
            {
                path: 'aboutmjaspage',
                name: 'AboutMjasPage',
                component: () => import('@/views/AboutMjasPage.vue'),
            },
        ]
    },

    {path: '/:catchAll(.*)', redirect: "/"},
];

export default routes;
