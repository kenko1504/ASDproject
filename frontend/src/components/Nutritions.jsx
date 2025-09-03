export default function Nutritions() {
  return (
    <div>
      <span className="title font-bold text-2xl">Nutritions</span>
      <span className="search !ml-5">
        <input type="text" placeholder="Type Food Name Here..." className="bg-gray-100 w-200" />
      </span>
      <div className="nutrition-info !mt-5">
        <table>
          <tr>
            <th>Food Name</th>
          </tr>
          {
            <tr>
              <td><a href="/nutritions/apple">Apple</a></td>
            </tr>
          }
        </table>
      </div>
    </div>
  );
}
