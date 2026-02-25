import { ButtonBase } from "../ui/ButtonBase";
import { useSelectedItemNodeValue } from "../../../jotai/useSelectedTreeNode";

export function EditImageButton() {
  const selectedItem = useSelectedItemNodeValue();
  if (!selectedItem) return null;

  const startEdit = () => {};
  return <ButtonBase type="edit" onClick={startEdit} />;
}
