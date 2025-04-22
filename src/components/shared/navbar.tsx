import { navLinks } from "@/constants"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"



const Navbar = () => {
    
  return (
    <div className="w-full h-[10vh] border-b fixed inset-0 z-50 bg-background ">
        <div className=" container mx-auto lg:max-w-5xl 2xl:max-w-screen-2xl 2xl:px-4 h-full max-sm:px-6 flex justify-between items-center">
            <Link to={'/'}>
            <h1 className="text-2xl font-bold uppercase">workout</h1>
            </Link>
            <div className="flex items-center gap-3 ">
                {navLinks.map((nav)=>(
                    <Link to={nav.path} key={nav.label} className="font-medium hover:underline max-sm:hidden">
                        {nav.label}
                    </Link>
                ))}
                <Link to={'/auth'}>
                <Button aria-label="join free" variant={"secondary"}>Join Free</Button>
                </Link>
               
            </div>
        </div>
    </div>
  )
}

export default Navbar