import Swal from "sweetalert2";

export function toastSuccess(title, text, timer = 1600) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer,
    showConfirmButton: false,
  });
}

export function toastError(title, text) {
  return Swal.fire({
    icon: "error",
    title,
    text,
  });
}

export function toastWarning(title, text) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
  });
}

export function confirmAction({ title, text, confirmText = "ยืนยัน", cancelText = "ยกเลิก" }) {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    cancelButtonColor: "#4a0080",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
}
