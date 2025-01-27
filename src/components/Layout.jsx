import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"
import Menu from "./Menu.jsx"

export default function Layout() {
    return (

            <div className="w-full mx-auto">
                <Header/>
                <main className="grid grid-cols-12 gap-2 my-4"
                      style={{minHeight: "calc(100vh - 160px)"}}>
                    <aside className="col-span-12 md:col-span-2 ">

                        <Menu/>
                    </aside>
                    <section className="col-span-12 md:col-span-10 p-2  rounded-xl">
                        <Outlet/>
                        </section>
                </main>
                <Footer/>
            </div>

)

}