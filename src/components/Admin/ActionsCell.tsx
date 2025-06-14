import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AlertModal from "@/components/AlertDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourt } from "@/services/courtService";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteSchedule } from "@/services/scheduleService";

interface ActionsCellProps {
  id: number | string;
  isOrder?: boolean;
  onDelete?: () => void;
  isSchedule?: boolean;
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  id,
  isOrder,
  isSchedule,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteCourtMutation = useMutation({
    mutationFn: deleteCourt,
    onSuccess: () => {
      toast.success(`Lapangan berhasil dihapus,`);
      router.replace("/admin/lapangan");
      queryClient.invalidateQueries({ queryKey: ["courts"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Gagal menghapus lapangan");
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      toast.success(`Jadwal berhasil dihapus,`);
      router.replace("/admin/jadwal");
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Gagal menghapus jadwal");
    },
  });

  const handleDelete = () => {
    if (isSchedule) {
      deleteScheduleMutation.mutate(id as string);
    } else {
      deleteCourtMutation.mutate(id as string);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <Link
            href={
              isOrder
                ? `/admin/pemesanan/edit/${id}`
                : isSchedule
                ? `/admin/jadwal/edit/${id}`
                : `/admin/lapangan/edit/${id}`
            }
            className="cursor-pointer"
          >
            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isModalOpen && (
        <AlertModal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default ActionsCell;
