
import ReservePage from "./details_page"

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return <ReservePage id={id} />
}
