type PaginationInput = {
  page: number;
  limit: number;
};

export const getPagination = ({ page, limit }: PaginationInput) => {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
};
