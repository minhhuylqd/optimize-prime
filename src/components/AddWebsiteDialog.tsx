import { CreateWebsiteSchema, createWebsiteSchema } from "@/lib/validation/website";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Web } from "@prisma/client";
import { useState } from "react";

interface AddWebsiteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  urlToEdit?: Web;
}

export default function AddWebsiteDialog({
  open,
  setOpen,
  urlToEdit: urlToEdit,
}: AddWebsiteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const router = useRouter();

  const form = useForm<CreateWebsiteSchema>({
    resolver: zodResolver(createWebsiteSchema),
    defaultValues: {
      title: urlToEdit?.title || "",
      url: urlToEdit?.url || "",
    },
  });

  async function onSubmit(input: CreateWebsiteSchema) {
    try {
      if (urlToEdit) {
        const response = await fetch("/api/website", {
          method: "PUT",
          body: JSON.stringify({
            id: urlToEdit.id,
            ...input,
          }),
        });
        if (!response.ok) {
          throw new Error("Status code: " + response.status);
        }
      } else {
        const response = await fetch("/api/website", {
          method: "POST",
          body: JSON.stringify(input),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Status code: " + response.status);
        }
        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }

  async function deleteWebsite() {
    if (!urlToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("/api/website", {
        method: "DELETE",
        body: JSON.stringify({ id: urlToEdit.id }),
      });
      if (!response.ok) {
        throw new Error("Status code: " + response.status);
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{urlToEdit ? "Edit URL" : "Add Website"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website title</FormLabel>
                  <FormControl>
                    <Input placeholder="Website title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {urlToEdit && (
                <LoadingButton
                  type="button"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteWebsite}
                  variant="destructive"
                >
                  Delete
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
