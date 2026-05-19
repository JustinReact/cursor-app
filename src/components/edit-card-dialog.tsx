"use client";

import { useActionState, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCardAction, deleteCardAction } from "@/actions/cards";
import type { SelectCard } from "@/schema";

type State = { error?: string } | null;

export function EditCardDialog({
  card,
  deckId,
}: {
  card: SelectCard;
  deckId: number;
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function editCardAction(_prev: State, formData: FormData): Promise<State> {
    try {
      await updateCardAction({
        cardId: card.id,
        deckId,
        front: formData.get("front") as string,
        back: formData.get("back") as string,
      });
      return null;
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Something went wrong" };
    }
  }

  const [state, formAction, pending] = useActionState(editCardAction, null);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCardAction({ cardId: card.id, deckId });
      setConfirmOpen(false);
      setOpen(false);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Edit card" />}
        >
          <Pencil className="size-3.5" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <form
            action={async (formData) => {
              await formAction(formData);
              setOpen(false);
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor={`front-${card.id}`}>Front</Label>
              <Input
                id={`front-${card.id}`}
                name="front"
                defaultValue={card.front}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`back-${card.id}`}>Back</Label>
              <Input
                id={`back-${card.id}`}
                name="back"
                defaultValue={card.back}
                required
              />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="destructive"
                disabled={pending}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="size-4 mr-1.5" />
                Delete Card
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this card?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The card will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
