import React, { useState } from 'react';
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

interface CompoundingInput {
    initialInvestment: number;
    interestRate: number;
    compoundingPeriod: 'yearly' | 'monthly' | 'weekly';
    contributionAmount: number;
    contributionFrequency: 'yearly' | 'monthly' | 'weekly' | 'none';
    numberOfMonths: number;
}

const CompundingCalculator: React.FC = () => {
    const [input, setInput] = useState<CompoundingInput>({
        initialInvestment: 0,
        interestRate: 0,
        compoundingPeriod: 'yearly',
        contributionAmount: 0,
        contributionFrequency: 'none', // Initialize to "none"
        numberOfMonths: 0,
    });
    const [calculatedValue, setCalculatedValue] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setInput({ ...input, [e.target.name]: parseFloat(e.target.value) || 0 }); // Handle empty strings
    };

    const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInput({ ...input, contributionFrequency: e.target.value as 'yearly' | 'monthly' | 'weekly' | 'none' });
    }

    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setInput({ ...input, compoundingPeriod: e.target.value as 'yearly' | 'monthly' | 'weekly' });
    }


    const calculateCompoundInterest = () => {
        // 1. Input Validation
        if (isNaN(input.initialInvestment) || isNaN(input.interestRate) || isNaN(input.numberOfMonths) || input.interestRate < 0 || input.numberOfMonths < 0) {
            setErrorMessage("Please enter valid numbers (Interest rate and Number of months cannot be negative).");
            setCalculatedValue(null);
            return;
        }

        setErrorMessage(null); // Clear any previous errors

        // 2. Calculation
        const principal = input.initialInvestment;
        const rate = input.interestRate / 100;
        const n = input.compoundingPeriod === 'yearly' ? 1 : (input.compoundingPeriod === 'monthly' ? 12 : 52); // Adjust n
        const t = input.numberOfMonths / 12;

        let futureValue = principal * Math.pow(1 + rate / n, n * t);

        // Handle contributions
        if (input.contributionFrequency !== 'none' && input.contributionAmount > 0) {
            const pmt = input.contributionAmount;
            const contributionN = input.contributionFrequency === 'yearly' ? 1 : (input.contributionFrequency === 'monthly' ? 12 : 52);
            futureValue += pmt * (Math.pow(1 + rate / contributionN, contributionN * t) - 1) / (rate / contributionN) * (1 + rate / contributionN);
        }

        setCalculatedValue(futureValue);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Compound Interest Calculator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid for better layout */}

                {/* Input Fields */}
                <div>
                    <label htmlFor="initialInvestment" className="block text-gray-700 font-bold mb-2">Initial Investment:</label>
                    <input type="number" id="initialInvestment" name="initialInvestment" value={input.initialInvestment} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>

                <div>
                    <label htmlFor="interestRate" className="block text-gray-700 font-bold mb-2">Interest Rate (%):</label>
                    <input type="number" id="interestRate" name="interestRate" value={input.interestRate} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>

                <div>
                    <label htmlFor="compoundingPeriod" className="block text-gray-700 font-bold mb-2">Compounding Period:</label>
                    <select id="compoundingPeriod" name="compoundingPeriod" value={input.compoundingPeriod} onChange={handlePeriodChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger>Select</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Yearly</DropdownMenuItem>
                            <DropdownMenuItem>Monthly</DropdownMenuItem>
                            <DropdownMenuItem>Weekly</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

                <div>
                    <label htmlFor="contributionAmount" className="block text-gray-700 font-bold mb-2">Contribution Amount:</label>
                    <input type="number" id="contributionAmount" name="contributionAmount" value={input.contributionAmount} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>

                <div>
                    <label htmlFor="contributionFrequency" className="block text-gray-700 font-bold mb-2">Contribution Frequency:</label>
                    <select id="contributionFrequency" name="contributionFrequency" value={input.contributionFrequency} onChange={handleFrequencyChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="none">None</option>
                        <option value="yearly">Yearly</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="numberOfMonths" className="block text-gray-700 font-bold mb-2">Number of Months:</label>
                    <input type="number" id="numberOfMonths" name="numberOfMonths" value={input.numberOfMonths} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
            </div>

            <button onClick={calculateCompoundInterest} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Calculate
            </button>
            <Button onClick={calculateCompoundInterest}>Calculate</Button>

            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            {calculatedValue !== null && (
                <div className="mt-6 border-t pt-4">
                    <p className="font-bold">Investment Value: {calculatedValue.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default CompundingCalculator;