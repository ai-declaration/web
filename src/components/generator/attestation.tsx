"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AideclSignature, FormErrors } from "@/lib/aidecl-types";

interface AttestationProps {
  values: AideclSignature;
  onChange: (field: string, value: string) => void;
  errors: FormErrors;
}

export default function Attestation({ values, onChange, errors }: AttestationProps) {
  const [showReviewer, setShowReviewer] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attestation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="declared-by">Declared By *</Label>
            <Input
              id="declared-by"
              placeholder="Your name"
              value={values.declared_by}
              onChange={(e) => onChange("signature.declared_by", e.target.value)}
              aria-invalid={!!errors["signature.declared_by"]}
              aria-describedby={errors["signature.declared_by"] ? "error-declared-by" : undefined}
            />
            {errors["signature.declared_by"] && (
              <p id="error-declared-by" role="alert" className="text-sm text-error">
                {errors["signature.declared_by"]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="declaration-date">Declaration Date</Label>
            <Input
              id="declaration-date"
              type="date"
              value={values.declaration_date}
              onChange={(e) => onChange("signature.declaration_date", e.target.value)}
            />
          </div>
        </div>

        {!showReviewer ? (
          <button
            type="button"
            onClick={() => setShowReviewer(true)}
            className="text-sm text-accent hover:underline"
          >
            + Add reviewer
          </button>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reviewed-by">Reviewed By</Label>
              <Input
                id="reviewed-by"
                placeholder="Reviewer name"
                value={values.reviewed_by || ""}
                onChange={(e) => onChange("signature.reviewed_by", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-date">Review Date</Label>
              <Input
                id="review-date"
                type="date"
                value={values.review_date || ""}
                onChange={(e) => onChange("signature.review_date", e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
