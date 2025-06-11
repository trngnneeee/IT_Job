import { toast, Toaster } from "sonner";


export const DeleteButton = (props: {
  api: string,
  item: any,
  onSuccess: (id: string) => void
}) => {
  const { api, item, onSuccess } = props;

  const handleDelete = () => {
    const confirm = window.confirm(`Xác nhận xóa công việc ${item.title}`);
    if (confirm)
    {
      fetch(api, {
        method: "DELETE",
        credentials: "include"
      })
        .then(res => res.json())
        .then((data) => {
          if (data.code == "error")
          {
            toast.error(data.message);
          }
          if (data.code == "success")
          {
            onSuccess(item.id);
          }
        })
    }
  }

  return (
    <>
      <Toaster/>
      <button
        onClick={handleDelete}
        className="bg-[#FF0000] rounded-[4px] font-[400] text-[14px] text-white inline-block py-[8px] px-[20px]"
      >
        Xóa
      </button>
    </>
  );
}