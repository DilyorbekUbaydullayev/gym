import { navLinks } from "@/constants"
import { Button } from "../ui/button"
import { ModeToggle } from "./mode-toggle"
import { Link } from "react-router-dom"
import { useUserState } from "@/stores/user.store"
import UserBox from "./userBox"


const Navbar = () => {
    const {user} = useUserState()
  return (
    <div className="w-full h-[10vh] border-b fixed inset-0 z-50 bg-background ">
        <div className=" container mx-auto lg:max-w-5xl 2xl:max-w-screen-2xl 2xl:px-4 h-full max-sm:px-6 flex justify-between items-center">
            <Link to={'/'}>
            <h1 className="text-2xl font-bold uppercase">workout</h1>
            </Link>
            <div className="flex items-center gap-3">
                {navLinks.map((nav)=>(
                    <a href={nav.path} key={nav.path} className="font-medium hover:underline">
                        {nav.label}
                    </a>
                ))}
                <ModeToggle/>
                {user?(<UserBox/>):( <Link to={'/auth'}>
                <Button variant={"secondary"}>Join Free</Button>
                </Link>)}
               
            </div>
        </div>
    </div>
  )
}

export default Navbar