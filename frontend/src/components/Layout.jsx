// Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Menu from "./Menu.jsx";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="w-full mx-auto pt-8 px-14  flex-grow">
                <main className="grid grid-cols-12 gap-2 mt-2">
                    <aside className="col-span-12 md:col-span-2">
                        <Menu />
                    </aside>
                    <section className="col-span-12 md:col-span-10 p-8 rounded-xl">
                        <Outlet />
                    </section>
                </main>
            </div>
            <Footer /> {/* Footer outside the main container */}
        </div>
    );
}