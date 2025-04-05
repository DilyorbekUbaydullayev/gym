import FillLoading from "@/components/shared/fillLoading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { db } from "@/firebase"
import { taskSchema } from "@/lib/validation"
import { useUserState } from "@/stores/user.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface Props{
    title?:string,
    isEdit?:boolean,
    onClose?:()=>void,
    handler:(values:z.infer<typeof taskSchema>)=>Promise<void>,
}

const TaskForm = ({title = '', handler,isEdit,onClose}:Props) => {
    const [isLoading,setIsLoading] = useState(false);

    const {user} = useUserState()

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {title},
      })
      const onSubmit = async (values:z.infer<typeof taskSchema>)=>{
        if(!user) return 
        setIsLoading(true)
        const {title} = values
        const promise =handler(values).finally(() => setIsLoading(false));

        toast.promise(promise,{
            loading:'Loading...',
            success:'Succsessfull',
            error:'Something went wrong'
        })
      }

  return (
    
    <div>
        {isLoading &&<FillLoading/>}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter a task" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {isEdit&&(
            <Button type="button" disabled={isLoading} variant={"destructive"} onClick={onClose}>
            Cancel
        </Button>
          )}
            <Button type="submit" disabled={isLoading}>
                Submit
            </Button>
        </div>
      </form>
        </Form>
    </div>
  )
}

export default TaskForm