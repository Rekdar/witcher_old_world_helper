import { Suspense } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import Home from '../pages/Home';
import ErrorPage from '../pages/ErrorPage';
import LostMount from '../pages/LostMount';
import MonsterRoller from '../pages/MonsterRoller';
import SetupHelper from '../pages/SetupHelper';
import LocationTokens from '../pages/LocationTokens';
import WitcherPicker from '../pages/WitcherPicker';
import Opponents from '../pages/Opponents';
import MonsterFight from '../pages/MonsterFight';
import { useTranslation } from 'react-i18next';


export default function App() {
    const { t, i18n } = useTranslation();
    const router = createHashRouter([
        {
            path: "/",
            element: <Home t={t} />,
            errorElement: <ErrorPage />,
        },
        {
            path: "lostMount",
            element: <LostMount t={t} />,
            errorElement: <ErrorPage />,
        },
        {
            path: "monsterRoller",
            element: <MonsterRoller t={t} />,
            errorElement: <ErrorPage />,
        },
        {
            path: "setupHelper",
            element: <SetupHelper t={t} />,
            errorElement: <ErrorPage />,
        },
        {
            path: "locationTokens",
            element: <LocationTokens t={t} />,
            errorElement: <ErrorPage />,
        },
        {
            path: "witcherPicker",
            element: <WitcherPicker t={t} />,
            errorElement: <ErrorPage />,
        },
        {
            path: "opponents",
            element: <Opponents t={t} />,
            errorElement: <ErrorPage />,
        },
        {
            path: "monsterFight",
            element: <MonsterFight t={t} />,
            errorElement: <ErrorPage />,
        },
        {
            // This should always be last
            path: "*",
            element: <ErrorPage />
        }
    ]);

    return (
        <Suspense fallback={<div>Loading....</div>}>
            <div
                className='flex-wrapper mx-0 px-0 d-flex flex-column'
                style={{
                    minHeight: '100vh',
                    justifyContent: 'flex-start'
                }}
            >
                <Navbar t={t} i18n={i18n} />
                <RouterProvider router={router} />
                <Footer t={t} />
            </div>
        </Suspense>
    );
}