"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCard } from "@/actions/cards";

type State = { error?: string } | null;

export function AddCardDialog({ deckId }: { deckId: number }) {
  const [open, setOpen] = useState(false);

  async function addCardAction(_prev: State, formData: FormData): Promise<State> {
    try {
      await createCard({
        deckId,
        front: formData.get("front") as string,
        back: formData.get("back") as string,
      });
      return null;
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Something went wrong" };
    }
  }

  const [state, formAction, pending] = useActionState(addCardAction, null);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus />
        Add Card
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await formAction(formData);
            setOpen(false);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="front">Front</Label>
            <Input
              id="front"
              name="front"
              placeholder="e.g. Hola"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="back">Back</Label>
            <Input
              id="back"
              name="back"
              placeholder="e.g. Hello"
              required
            />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Adding…" : "Add Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
