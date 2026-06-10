import Navbar from '../components/Navbar'
import MemberList from '../components/MemberList'

export default function MembersPage() {
  return (
    <>
      <Navbar />
      <div className="members-page">
        <h2>Members</h2>
        <MemberList />
      </div>
    </>
  )
}