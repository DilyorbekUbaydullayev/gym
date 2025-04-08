import FillLoading from "@/components/shared/fillLoading"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { taskSchema } from "@/lib/validation"
import { useUserState } from "@/stores/user.store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface Props{
    title?:string,
    timer?:string,
    isEdit?:boolean,
    onClose?:()=>void,
    handler:(values:z.infer<typeof taskSchema>)=>Promise<void>,
}

const TaskForm = ({title = '',timer='', handler,isEdit,onClose}:Props) => {
    const [isLoading,setIsLoading] = useState(false);

    const {user} = useUserState()

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {title,timer},
      })
      const onSubmit = async (values:z.infer<typeof taskSchema>)=>{
        if(!user) return 
        setIsLoading(true)
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
        <FormField
          control={form.control}
          name="timer"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Enter a task time(seconds)" type="number" disabled={isLoading} {...field} />
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