import pytest
from decimal import Decimal
from estate_distribution import IntestacyCalculator

@pytest.fixture
def calculator():
    calc = IntestacyCalculator()
    calc.state.update({
        "name": "Test User",
        "estate_value": 500000,
        "married": None,
        "children": None,
        "parents_alive": None,
        "current_question": 0
    })
    return calc

def test_validate_estate_value(calculator):
    """Test estate value validation"""
    assert calculator.validate_estate_value(100000)[0] is True
    assert calculator.validate_estate_value(0)[0] is False
    assert calculator.validate_estate_value(-1000)[0] is False
    assert calculator.validate_estate_value(None)[0] is False

def test_spouse_and_children_large_estate(calculator):
    """Test distribution with spouse and children for estate over £322,000"""
    calculator.state.update({
        "married": True,
        "children": True
    })
    result = calculator.calculate_distribution()
    assert "£411,000.00" in result  # £322,000 + (£178,000/2)
    assert "£89,000.00" in result   # £178,000/2

def test_spouse_and_children_small_estate(calculator):
    """Test distribution with spouse and children for estate under £322,000"""
    calculator.state["estate_value"] = 300000
    calculator.state.update({
        "married": True,
        "children": True
    })
    result = calculator.calculate_distribution()
    assert "£300,000.00" in result
    assert "will go to your spouse" in result

def test_spouse_only(calculator):
    """Test distribution with spouse only"""
    calculator.state.update({
        "married": True,
        "children": False
    })
    result = calculator.calculate_distribution()
    assert "£500,000.00" in result
    assert "will go to your spouse" in result

def test_children_only(calculator):
    """Test distribution with children only"""
    calculator.state.update({
        "married": False,
        "children": True
    })
    result = calculator.calculate_distribution()
    assert "£500,000.00" in result
    assert "divided equally between your children" in result

def test_parents_only(calculator):
    """Test distribution with parents only"""
    calculator.state.update({
        "married": False,
        "children": False,
        "parents_alive": True
    })
    result = calculator.calculate_distribution()
    assert "£500,000.00" in result
    assert "surviving parents" in result

def test_crown_inheritance(calculator):
    """Test distribution with no eligible relatives"""
    calculator.state.update({
        "married": False,
        "children": False,
        "parents_alive": False
    })
    result = calculator.calculate_distribution()
    assert "£500,000.00" in result
    assert "Crown (Bona Vacantia)" in result

def test_question_flow(calculator):
    """Test that questions follow correct order"""
    assert "married" in calculator.questions[0].lower()
    assert "children" in calculator.questions[1].lower()
    assert "parents" in calculator.questions[2].lower()
