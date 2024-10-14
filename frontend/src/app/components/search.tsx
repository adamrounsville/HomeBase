import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
 
function SearchBar() {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input type="search" placeholder="Enter a Location" />
      <Button type="submit">Search</Button>
    </div>
  )
}

export default SearchBar;