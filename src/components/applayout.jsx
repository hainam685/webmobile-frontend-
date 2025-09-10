import NavBar from './navBar/navBar.jsx';
import FooterSection from './footerSection/footerSection.jsx';
import { useSelector } from "react-redux";
import { Outlet, useLocation } from 'react-router-dom';
import "../css/applayout.css";

const AppLayout = () => {
    const profile = useSelector(state => state.profile.Profile);
    const location = useLocation();
    return (
        <div className="layout" key={location.pathname}>
            <header className="header">Hotline: 0332651691 - 0366336842</header>
            <NavBar profile={profile} />
            <main className="main-content">
                <Outlet />
            </main>
            <FooterSection />
        </div>
    );
};

export default AppLayout;
