import { ButtonBase } from "../ui/ButtonBase";
import { useSelected } from "../../../jotai/useSelected";

export function EditImageButton() {
  const selectedItem = useSelected.useItemNodeValue();
  if (!selectedItem) return null;

  const startEdit = () => {};
  return <ButtonBase type="edit" onClick={startEdit} />;
}
