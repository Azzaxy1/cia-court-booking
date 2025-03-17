import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Order } from "@/types/Order";

const OrderForm = ({
  isAddForm,
  order,
}: {
  isAddForm?: boolean;
  order?: Order;
}) => {
  const router = useRouter();

  // Opsi untuk dropdown
  const fieldTypes = ["Badminton", "Futsal", "Tenis Meja"];
  const durationOptions = [1, 2, 3, 4];
  const statusOptions = ["Pending", "Paid", "Cancelled"];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    fieldType: "",
    date: "",
    startTime: "",
    duration: "",
    totalPrice: "",
    status: "Pending",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        date: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const calculateEndTime = (startTime: string, duration: string) => {
    if (!startTime || !duration) return "";

    const [hours, minutes] = startTime.split(":").map(Number);
    const endHour = hours + parseInt(duration);

    return `${endHour.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const calculatePrice = (fieldType: string, duration: string) => {
    if (!fieldType || !duration) return "";

    let basePrice = 0;
    switch (fieldType) {
      case "Badminton":
        basePrice = 60000;
        break;
      case "Futsal":
        basePrice = 100000;
        break;
      case "Tenis Meja":
        basePrice = 40000;
        break;
      default:
        basePrice = 0;
    }

    return basePrice * parseInt(duration);
  };

  // Perbarui harga total ketika field type atau durasi berubah
  useEffect(() => {
    if (formData.fieldType && formData.duration) {
      const price = calculatePrice(formData.fieldType, formData.duration);
      setFormData((prev) => ({
        ...prev,
        totalPrice: price.toString(),
      }));
    }
  }, [formData.fieldType, formData.duration]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulasi pengiriman data ke API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Dalam implementasi nyata, Anda akan mengirim data ke API
      console.log("Data pemesanan yang dikirim:", {
        ...formData,
        id: `TRX${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
        time: `${formData.startTime} - ${calculateEndTime(
          formData.startTime,
          formData.duration
        )}`,
      });

      toast.success("Pemesanan berhasil ditambahkan");

      // Redirect ke halaman daftar pemesanan
      router.push("/admin/pemesanan");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Gagal menambahkan pemesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTime = order?.time?.split(" - ")[0];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {isAddForm ? "Tambah Pemesanan Baru" : "Edit Pemesanan"}
        </CardTitle>
        <CardDescription>
          Isi form berikut untuk {isAddForm ? "menambahkan" : "mengedit"} data
          pemesanan
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Customer */}
          <div className="space-y-2">
            <Label htmlFor="customer">Nama Pelanggan</Label>
            <Input
              id="customer"
              name="customer"
              placeholder="Masukkan nama pelanggan"
              value={order?.customer || formData.customer}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Field Type */}
          <div className="space-y-2">
            <Label htmlFor="fieldType">Jenis Lapangan</Label>
            <Select
              value={order?.fieldType || formData.fieldType}
              onValueChange={(value) => handleSelectChange("fieldType", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis lapangan" />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => handleDateSelect(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Waktu Mulai</Label>
              <Select
                value={startTime || formData.startTime}
                onValueChange={(value) =>
                  handleSelectChange("startTime", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih waktu" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durasi (jam)</Label>
              <Select
                value={isAddForm ? formData.duration : String(order?.duration)}
                onValueChange={(value) => handleSelectChange("duration", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih durasi" />
                </SelectTrigger>
                <SelectContent>
                  {durationOptions.map((duration) => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} jam
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Total Price and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalPrice">Total Harga</Label>
              <Input
                id="totalPrice"
                name="totalPrice"
                value={
                  isAddForm
                    ? formData.totalPrice &&
                      `Rp ${Number(formData.totalPrice).toLocaleString()}`
                    : `Rp ${order?.totalPrice}`
                }
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={order?.status || formData.status}
                defaultValue="Pending"
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OrderForm;
