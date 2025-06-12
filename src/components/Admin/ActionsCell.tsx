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

interface ActionsCellProps {
  id: number | string;
  isOrder?: boolean;
  onDelete?: () => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ id, isOrder }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
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

  const handleDelete = () => {
    deleteMutation.mutate(id as string);
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
            href={` ${
              isOrder ? "/admin/pemesanan" : "/admin/lapangan"
            }/edit/${id}`}
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
