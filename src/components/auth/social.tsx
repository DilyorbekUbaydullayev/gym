import { FaGithub, FaGoogle } from "react-icons/fa6"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

const Social = () => {
  return (
    <>
    <Separator className="-my-1" />
    <div className="grid grid-cols-2 gap-2">
        <Button className="h-11 " variant={'secondary'}>
            <FaGithub/>
            <span>Sign in with Github</span>
        </Button>
        <Button className="h-11" variant={'destructive'}>
            <FaGoogle/>
            <span>Sign in with Google</span>
        </Button>
    </div>
    </>
  )
}

export default Social