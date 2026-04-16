"use client"

import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Star, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface Props {
  appointmentId: string
  clinicId: string
  patientId: string
  memberId: string | null
}

export function ReviewClient({ clinicId, patientId, memberId }: Props) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState("")
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  function handleSubmit() {
    if (!rating) return
    startTransition(async () => {
      const supabase = createClient()
      const { error } = await supabase.from("reviews").insert({
        clinic_id: clinicId,
        patient_id: patientId,
        member_id: memberId,
        rating,
        comment: comment.trim() || null,
        is_published: true,
      })
      if (error) {
        toast.error("Erro ao enviar avaliação")
        return
      }
      setDone(true)
      toast.success("Obrigado pela avaliação!")
      setTimeout(() => router.push("/"), 2000)
    })
  }

  if (done) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-8 text-center">
        <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-1">Obrigado!</h3>
        <p className="text-muted-foreground text-sm">Sua avaliação foi enviada.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6 space-y-6">
      <div>
        <p className="text-sm font-medium mb-3 text-center">Nota geral</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(i)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 transition-colors ${
                  i <= (hovered || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200 dark:text-slate-700"
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-center text-sm mt-2 text-muted-foreground">
            {["", "Muito ruim", "Ruim", "Regular", "Bom", "Excelente"][rating]}
          </p>
        )}
      </div>

      <div>
        <p className="text-sm font-medium mb-2">Comentário (opcional)</p>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Como foi sua experiência?"
          rows={4}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending || !rating}
        className="w-full bg-[#0D3A6B] hover:bg-[#1A5599] text-white"
      >
        {isPending ? "Enviando..." : "Enviar avaliação"}
      </Button>
    </div>
  )
}
