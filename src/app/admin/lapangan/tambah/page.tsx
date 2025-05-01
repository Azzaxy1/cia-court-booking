import CourtForm from "@/components/Admin/Court/court-form";
import BackButton from "@/components/BackButton";

const AddCourtPage = () => {
  return (
    <div className="container  mx-auto pb-8">
      <BackButton />

      <CourtForm isAddForm />
    </div>
  );
};

export default AddCourtPage;
