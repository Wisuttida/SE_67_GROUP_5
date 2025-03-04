import { Label } from "@/components/ui/label"; // Adjust the import based on your actual library structure
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Adjust the import based on your actual library structure

const bankOptions = [
  { value: 'ธนาคารกรุงเทพ (BBL)', label: 'ธนาคารกรุงเทพ (BBL)' },
  { value: 'ธนาคารกสิกรไทย (KBANK)', label: 'ธนาคารกสิกรไทย (KBANK)' },
  { value: 'ธนาคารไทยพาณิชย์ (SCB)', label: 'ธนาคารไทยพาณิชย์ (SCB)' },
  { value: 'ธนาคารกรุงไทย (KTB)', label: 'ธนาคารกรุงไทย (KTB)' },
  { value: 'ธนาคารกรุงศรีอยุธยา (BAY)', label: 'ธนาคารกรุงศรีอยุธยา (BAY)' },
  { value: 'ธนาคารทหารไทยธนชาต (TTB)', label: 'ธนาคารทหารไทยธนชาต (TTB)' },
  { value: 'ธนาคารซีไอเอ็มบี ไทย (CIMBT)', label: 'ธนาคารซีไอเอ็มบี ไทย (CIMBT)' },
  { value: 'ธนาคารยูโอบี (UOB Thailand)', label: 'ธนาคารยูโอบี (UOB Thailand)' },
  { value: 'ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)', label: 'ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)' },
  { value: 'ธนาคารออมสิน (GSB)', label: 'ธนาคารออมสิน (GSB)' },
];

const BankSelect = ({ formData, setFormData }) => {
    const handleChange = (value) => {
      setFormData({ ...formData, bank_name: value });
    };
  
    return (
      <div>
        <Label>Bank Name</Label>
        <Select onValueChange={handleChange} defaultValue={formData.bank_name}>
          <SelectTrigger>
            <SelectValue placeholder="Select a bank" />
          </SelectTrigger>
          <SelectContent>
            {bankOptions.map((bank) => (
              <SelectItem key={bank.value} value={bank.value}>
                {bank.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };
  
  export default BankSelect;