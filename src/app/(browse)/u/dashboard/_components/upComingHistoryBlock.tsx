"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ComponentsProps {
  appointments: ({
    doctor: {
      user: {
        first_name: string;
        last_name: string;
      };
    };
  } & Appointment)[];
  title: string;
}

export default function Component({ appointments, title }: ComponentsProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>Recent orders from your store.</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Table>
          {appointments.length === 0 && <div>No appointments found</div>}
          {appointments.length > 0 && (
            <TableHeader>
              <TableRow>
                <TableHead>Doctor's Name</TableHead>
                <TableHead className="tab:hidden table-cell">Status</TableHead>
                <TableHead className="tab:hidden table-cell">Reason</TableHead>
                <TableHead className="">Appointment Date & Time</TableHead>
                <TableHead className="">Meeting Room</TableHead>
                <TableHead className="">Prescription</TableHead>
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {appointments.length > 0 &&
              appointments.map((appointment) => {

                let prescriptionUrl : string = '';
                appointment.prescriptionUrl?.split('/')
                ?.forEach( (val) => {
                  if(val === 'upload'){
                    prescriptionUrl = prescriptionUrl + '/' + val + '/fl_attachment:prescription';
                  }
                  else{
                    prescriptionUrl = prescriptionUrl + '/' + val;
                  }
                })
                prescriptionUrl = prescriptionUrl.substring(1);

                return (
                  <TableRow className="bg-accent" key={appointment.id}>
                    <TableCell>
                      <div className="font-medium capitalize">
                        {appointment.doctor.user.first_name}&nbsp;
                        {appointment.doctor.user.last_name}
                      </div>
                      {/* <div className="hidden text-sm text-muted-foreground md:inline"></div> */}
                    </TableCell>
                    <TableCell className="tab:hidden table-cell">
                      {appointment.reason}
                    </TableCell>
                    <TableCell className="tab:hidden table-cell">
                      <Badge className="text-xs" variant="secondary">
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="">
                      {format(appointment.AppointmentDateTime, "Pp")}
                    </TableCell>
                    <TableCell className="">
                      <Button
                        variant={
                          appointment.status.toLowerCase() === "completed"
                            ? "outline"
                            : "default"
                        }
                        onClick={() =>
                          router.replace(`/stream/${appointment.roomId}`)
                        }
                        disabled={
                          new Date() < appointment.AppointmentDateTime ||
                          appointment.status.toLowerCase() === "completed"
                        }
                      >
                        {appointment.status.toLowerCase() === "completed"
                          ? "Completed"
                          : "Join Now"}
                      </Button>
                    </TableCell>
                    <TableCell className="">
                      <Button
                        variant={"secondary"}
                        disabled={!appointment.prescriptionUrl}
                      >
                        {appointment.prescriptionUrl ? (
                          <Link
                            href={prescriptionUrl}
                          >
                            Download
                          </Link>
                        ) : (
                          "Download"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
