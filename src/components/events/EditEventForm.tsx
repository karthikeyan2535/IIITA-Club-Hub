
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useUpdateEvent } from "@/hooks/useEventManagement";
import type { Event } from "@/types/models";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location is required"),
  maxParticipants: z.string().optional(),
  eligibility: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EditEventFormProps {
  event: Event;
  onSuccess?: () => void;
}

const EditEventForm = ({ event, onSuccess }: EditEventFormProps) => {
  const { mutate: updateEvent, isPending } = useUpdateEvent();
  const [rules, setRules] = React.useState<string[]>(event.rules || []);
  const [ruleInput, setRuleInput] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      maxParticipants: event.maxParticipants?.toString(),
      eligibility: event.eligibility,
    },
  });

  const onSubmit = (data: EventFormValues) => {
    updateEvent(
      {
        eventId: event.id,
        data: {
          ...data,
          maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined,
          rules,
          clubId: event.clubId,
        },
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      }
    );
  };

  const addRule = () => {
    if (ruleInput.trim()) {
      setRules([...rules, ruleInput.trim()]);
      setRuleInput("");
    }
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <Input {...register("title")} placeholder="Enter event title" />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Describe the event"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input {...register("date")} type="date" />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <Input {...register("time")} type="time" />
              {errors.time && (
                <p className="text-red-500 text-xs mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <Input {...register("location")} placeholder="Event location" />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Maximum Participants (Optional)
            </label>
            <Input
              {...register("maxParticipants")}
              type="number"
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Eligibility Criteria (Optional)
            </label>
            <Input
              {...register("eligibility")}
              placeholder="Who can participate in this event"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rules</label>
            <div className="flex space-x-2">
              <Input
                value={ruleInput}
                onChange={(e) => setRuleInput(e.target.value)}
                placeholder="Add rule"
              />
              <Button type="button" onClick={addRule} variant="outline">
                Add
              </Button>
            </div>
            {rules.length > 0 && (
              <ul className="mt-2 space-y-1">
                {rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <span>{rule}</span>
                    <Button
                      type="button"
                      onClick={() => removeRule(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating Event..." : "Update Event"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditEventForm;
