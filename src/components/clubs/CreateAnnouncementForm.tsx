
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateAnnouncement } from "@/hooks/useAnnouncements";

const announcementSchema = z.object({
  title: z.string().min(3, "Title is required and must be at least 3 characters"),
  content: z.string().min(10, "Content is required and must be at least 10 characters"),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

interface CreateAnnouncementFormProps {
  clubId: string;
  onSuccess?: () => void;
}

const CreateAnnouncementForm = ({ clubId, onSuccess }: CreateAnnouncementFormProps) => {
  const { mutate: createAnnouncement, isPending } = useCreateAnnouncement();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: AnnouncementFormValues) => {
    createAnnouncement(
      {
        clubId,
        title: data.title,
        content: data.content,
      },
      {
        onSuccess: () => {
          reset();
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Announcement Title</label>
            <Input {...register("title")} placeholder="Enter announcement title" />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <Textarea
              {...register("content")}
              placeholder="Announcement content"
              rows={4}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating Announcement..." : "Post Announcement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAnnouncementForm;
