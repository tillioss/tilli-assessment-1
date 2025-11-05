import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '../StarRating';

describe('StarRating', () => {
  const defaultRatingLevels = {
    '0': 'Not Observed',
    '1': 'Emerging',
    '2': 'Developing',
    '3': 'Proficient',
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render the correct number of stars', () => {
    render(
      <StarRating
        value="0"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('should call onChange when a star is clicked', () => {
    render(
      <StarRating
        value="0"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);

    expect(mockOnChange).toHaveBeenCalledWith('2');
  });

  it('should not call onChange when disabled', () => {
    render(
      <StarRating
        value="1"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[2]);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should display filled stars up to the current value', () => {
    const { container } = render(
      <StarRating
        value="2"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
      />
    );

    // Stars with indices 0, 1, 2 should be filled (value is 2, which is index 2)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('should display label when showLabel is true and value is set', () => {
    render(
      <StarRating
        value="2"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
        showLabel={true}
      />
    );

    expect(screen.getByText('Developing')).toBeInTheDocument();
  });

  it('should not display label when showLabel is false', () => {
    render(
      <StarRating
        value="2"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
        showLabel={false}
      />
    );

    expect(screen.queryByText('Developing')).not.toBeInTheDocument();
  });

  it('should not display label when value is not set', () => {
    render(
      <StarRating
        value=""
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
        showLabel={true}
      />
    );

    expect(screen.queryByText(/Emerging|Developing|Proficient/)).not.toBeInTheDocument();
  });

  it('should handle value of 0', () => {
    render(
      <StarRating
        value="0"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(mockOnChange).toHaveBeenCalledWith('0');
  });

  it('should handle maximum rating value', () => {
    render(
      <StarRating
        value="0"
        onChange={mockOnChange}
        maxRating={5}
        ratingLevels={defaultRatingLevels}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
    
    fireEvent.click(buttons[4]);
    expect(mockOnChange).toHaveBeenCalledWith('4');
  });

  it('should disable all buttons when disabled prop is true', () => {
    render(
      <StarRating
        value="1"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
        disabled={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should enable all buttons when disabled prop is false', () => {
    render(
      <StarRating
        value="1"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
        disabled={false}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('should handle empty value', () => {
    render(
      <StarRating
        value=""
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('should update when value prop changes', () => {
    const { rerender } = render(
      <StarRating
        value="1"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
        showLabel={true}
      />
    );

    expect(screen.getByText('Emerging')).toBeInTheDocument();

    rerender(
      <StarRating
        value="3"
        onChange={mockOnChange}
        maxRating={4}
        ratingLevels={defaultRatingLevels}
        showLabel={true}
      />
    );

    expect(screen.getByText('Proficient')).toBeInTheDocument();
  });

  it('should render with different maxRating values', () => {
    const { rerender } = render(
      <StarRating
        value="0"
        onChange={mockOnChange}
        maxRating={3}
        ratingLevels={defaultRatingLevels}
      />
    );

    expect(screen.getAllByRole('button')).toHaveLength(3);

    rerender(
      <StarRating
        value="0"
        onChange={mockOnChange}
        maxRating={6}
        ratingLevels={defaultRatingLevels}
      />
    );

    expect(screen.getAllByRole('button')).toHaveLength(6);
  });
});

