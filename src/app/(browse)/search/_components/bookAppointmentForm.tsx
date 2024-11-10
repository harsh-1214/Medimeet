"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { Label } from "@/components/ui/label";
import { DatePicker } from "./DatePicker";
import { useState, useTransition } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enIN } from "date-fns/locale";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format,isPast, isToday } from "date-fns";
import { bookMyAppointment } from "@/actions/bookAppointment";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function BookAppointment({doctorId,variant} : {doctorId: string,variant : "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined})
 {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [reason,setReason] = useState(''); 
  const [time, setTime] = useState<Date | null>(new Date());
  const [isPending, startTransition] = useTransition();
  const [isEmptyDate, setIsEmptyDate] = useState(false);
  const [isInValidTime, setIsInValidTime] = useState(false);
  // const closeRef = useRef<'button'>()

  function handleDate(val: Date | undefined) {
    setDate(val);
    if (val) {
      setIsEmptyDate(false);
    }
  }

  function handleTime(timeVal : Date | null){
    
    // Case 1 :- Today Date
    
    if(!timeVal || !date){
      // Try to send message , Please Select Date First
      toast.error('Please Select Date First');
      return
    }
    if(isToday(date) && isPast(timeVal)){
      setIsInValidTime(true)
      return
    }
    setIsInValidTime(false)
    setTime(timeVal)
  }

  function handleSubmit() {
    if (!date) {
      setIsEmptyDate(true);
      return;
    }
    setIsEmptyDate(false);
    if(isInValidTime) {
      return
    }
    const dateTimeString = date.toString().substring(0, 16) + time?.toString().substring(16);
    const mergedDate = new Date(dateTimeString);


    startTransition( () => {
        bookMyAppointment( {reason,AppointmentDateTime : mergedDate,doctorId} )
        .then( () => {
          toast.success('Appointment Booked successfully')
          router.push('/u/dashboard/upcoming_Appointments')
        })
        .catch( (err) => {
          toast.error(err?.message)
          router.replace('/sign-in')
        });
    })

  }
  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <Button className="w-full" variant={variant} >Book Appointment</Button>
      </DialogTrigger>
      {/* sm:max-w-[425px] */}
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-center">
            Book Your Appointment
          </DialogTitle>
          <DialogDescription className="text-center"></DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="">
              Reason(optional)
            </Label>
            <Input
              id="name"
              placeholder="Reason for your appointment..."
              className=""
              value={reason}
              onChange={ (ev) => setReason(ev.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="">Pick Your Appointment Date</Label>
            <DatePicker date={date} handleDate={handleDate} />
            <span className="text-red-500 text-sm">
              {isEmptyDate && "Please Select a Date"}
            </span>
          </div>
          <div>
            <Label className="">Pick Your Appointment Time</Label>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={enIN}
            >
              <TimePicker
                className="w-full"
                value={time}
                onChange={handleTime}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              />
            </LocalizationProvider>
            <span className="text-red-500 text-sm">
              {isInValidTime && 'Please Select a Valid Time'}
            </span>
          </div>
        </div>
        <DialogFooter>
          {/* <DialogClose> */}
          {/* </DialogClose> */}
          <Button disabled={isPending} onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
