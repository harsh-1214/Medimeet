"use client";

import { addAppointmentPrescription } from "@/actions/stream";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { UploadCloud } from "lucide-react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ComponentsProps {
  appointments: ({
    patient: {
      user: {
        first_name: string;
        last_name: string;
      };
    };
  } & Appointment)[];
  title: string;
}

export default function ScheduledAppointmentsComponent({
  appointments,
  title,
}: ComponentsProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>{title}</CardTitle>
        {/* <CardDescription>Recent orders from your store.</CardDescription> */}
      </CardHeader>
      <CardContent>
        {appointments.length === 0 && <div>No appointments found</div>}
        <Table>
          {appointments.length > 0 && (
            <TableHeader>
              <TableRow>
                <TableHead>Patient's Name</TableHead>
                <TableHead className="tab:hidden table-cell">Reason</TableHead>
                <TableHead className="tab:hidden table-cell">Status</TableHead>
                <TableHead className="">Appointment Date & Time</TableHead>
                <TableHead className="">Meeting Room</TableHead>
                <TableHead className="">Prescription</TableHead>
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {appointments.length > 0 &&
              appointments.map((appointment) => (
                <TableRow className="bg-accent" key={appointment.id}>
                  <TableCell className="font-medium">
                    <div className="font-medium capitalize">
                      {appointment.patient.user.first_name}&nbsp;
                      {appointment.patient.user.last_name}
                    </div>
                    {/* <div className="hidden text-sm text-muted-foreground md:inline"></div> */}
                  </TableCell>
                  <TableCell className="tab:hidden table-cell">
                    {/* {appointment.reason?.length && appointment.reason?.length > 10 ? appointment.reason?.substring(10) : appointment.reason} */}
                    {
                      appointment.reason
                    }
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
                        // new Date() < appointment.AppointmentDateTime ||
                        appointment.status.toLowerCase() === "completed"
                      }
                    >
                      {appointment.status.toLowerCase() === "completed"
                        ? "Completed"
                        : "Join Now"}
                    </Button>
                  </TableCell>
                  <TableCell className="">
                    {!appointment.prescriptionUrl ? (
                      <CldUploadButton
                        className="w-full py-2 px-1 rounded-md bg-gray-100 flex items-center justify-center gap-2"
                        options={{ multiple: false }}
                        uploadPreset="ybwdxqf0"
                        onSuccess={async (res) => {
                          if (typeof res.info === "object") {
                            const url = res.info.secure_url;
                            try {
                              await addAppointmentPrescription(
                                appointment.id,
                                url
                              );
                              router.refresh();
                            } catch (err) {
                              toast.error(
                                "Failed to upload Prescription, Please try again later"
                              );
                            }
                          } else {
                            toast.error(
                              "Failed to upload Prescription, Please try again later"
                            );
                          }
                        }}
                      >
                        <UploadCloud
                          // className="absolute top-[50%] left-[30%] -translate-y-1"
                          width={30}
                          height={30}
                        />
                        <span>Upload</span>
                      </CldUploadButton>
                    ) : (
                      <Button variant={"secondary"}>View Prescription</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
