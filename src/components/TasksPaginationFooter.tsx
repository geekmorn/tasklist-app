"use client";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type Props = {
  showingCount: number;
  totalCount: number;
  current: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoto: (page: number) => void;
};

export function TasksPaginationFooter({ showingCount, totalCount, current, totalPages, onPrev, onNext, onGoto }: Props) {
  return (
    <>
      <p className="text-xs text-muted-foreground whitespace-nowrap">
        Showing {showingCount} of {totalCount}
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); onPrev(); }} />
          </PaginationItem>
          {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
            const page = i + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink href="#" isActive={page === current} onClick={(e) => { e.preventDefault(); onGoto(page); }}>{page}</PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext href="#" onClick={(e) => { e.preventDefault(); onNext(); }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}


