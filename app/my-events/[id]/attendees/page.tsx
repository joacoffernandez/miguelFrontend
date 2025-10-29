
import ReservePage from "./page_attendees"

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  const { id } = await params
  return <ReservePage id={id} />
}

