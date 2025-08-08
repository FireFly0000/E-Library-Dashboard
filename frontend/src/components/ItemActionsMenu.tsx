import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, CircleX, LucideIcon } from "lucide-react";
import Modal from "./Modal";
import { Button } from "./ui/button";

export type ItemAction<ItemType> = {
  icon: LucideIcon;
  label: string;
  subLabel: string;
  needsConfirm: boolean;
  modalTitle?: () => string;
  onConfirm?: (item: ItemType) => Promise<void>;
};

type ItemActionsMenuProps<ItemType> = {
  item: ItemType;
  actions: ItemAction<ItemType>[];
  onActionComplete?: () => void;
};

export function ItemActionsMenu<ItemType>({
  item,
  actions,
  onActionComplete,
}: ItemActionsMenuProps<ItemType>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedActionIndex, setSelectedActionIndex] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const actionsMenuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const isScrollbarClick =
        (window.innerWidth > document.documentElement.clientWidth &&
          event.clientX >= document.documentElement.clientWidth) ||
        (window.innerHeight > document.documentElement.clientHeight &&
          event.clientY >= document.documentElement.clientHeight);

      if (
        !isScrollbarClick &&
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(target) //&&
        //openMenu !== null
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //Actions handling functions
  const handleActionClick = (index: number) => {
    const action = actions[index];

    setSelectedActionIndex(index);

    if (action.needsConfirm) {
      setModalTitle(action.modalTitle || "Are you sure?");
      setModalOpen(true);
    } else {
      action.onConfirm?.(item).then(onActionComplete);
    }

    setMenuOpen(false);
  };

  const handleConfirm = async () => {
    if (selectedActionIndex === null) return;

    await actions[selectedActionIndex].onConfirm?.(item);
    setModalOpen(false);
    setSelectedActionIndex(null);
    onActionComplete?.();
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedActionIndex(null);
  };

  return (
    <div className="relative w-fit" ref={actionsMenuRef}>
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="cursor-pointer"
      >
        {menuOpen ? (
          <CircleX className="text-destructive mt-[-2px]" />
        ) : (
          <MoreHorizontal className="text-foreground mt-[-2px]" />
        )}
      </button>

      {menuOpen && (
        <div
          className="absolute top-7 right-0 w-[290px] md:w-[340px] bg-card border-2 border-primary rounded-lg shadow-xl"
          ref={actionsMenuRef}
        >
          <div className="flex flex-col">
            {actions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleActionClick(index)}
                className="flex items-start gap-3 py-3 px-2 border-b-2 border-foreground/60 hover:bg-muted-foreground/20 last:border-b-0 cursor-pointer"
              >
                <action.icon className="w-6 h-6" />
                <div className="flex flex-col">
                  <span className="text-sm md:text-base text-foreground font-semibold">
                    {action.label}
                  </span>
                  <span className="text-xs md:text-sm text-foreground">
                    {action.subLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalOpen && (
        <Modal title={modalTitle} isOpen={modalOpen} onClose={handleCancel}>
          <div className="flex justify-center gap-4 pt-4" ref={actionsMenuRef}>
            <Button size="lg" variant="destructive" onClick={handleConfirm}>
              Confirm
            </Button>
            <Button size="lg" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
