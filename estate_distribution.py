import gradio as gr
from decimal import Decimal
from typing import Dict, List, Optional, Tuple, Any

class IntestacyCalculator:
    # Updated to the latest statutory legacy amount
    STATUTORY_LEGACY = Decimal('322000.00')
    
    def __init__(self):
        self.state = {
            "name": None,
            "estate_value": None,
            "married": None,
            "children": None,
            "grandchildren": None,
            "great_grandchildren": None,
            "parents_alive": None,
            "siblings": None,
            "full_siblings": None,  # Added distinction between full and half siblings
            "half_siblings": None,
            "grandparents": None,
            "aunts_uncles": None,
            "full_aunts_uncles": None,  # Added distinction between full and half aunts/uncles
            "half_aunts_uncles": None,
            "current_question": 0,
            "children_deceased": None,
            "deceased_children_had_children": None,
            "siblings_deceased_with_children": None,
            "aunts_uncles_deceased_with_children": None
        }
        
        # Redesigned questions list with clearer hierarchy
        self.questions = [
            {"id": "married", "text": "Are you married or in a civil partnership?"},
            {"id": "children", "text": "Do you have any children?"},
            {"id": "children_deceased", "text": "Are any of your children deceased?"},
            {"id": "deceased_children_had_children", "text": "Did any of your deceased children have children of their own?"},
            {"id": "parents_alive", "text": "Are either of your parents alive?"},
            {"id": "siblings", "text": "Do you have any siblings?"},
            {"id": "full_siblings", "text": "Do you have any full siblings (same two parents)?"},
            {"id": "siblings_deceased_with_children", "text": "Are any of your siblings deceased with children of their own?"},
            {"id": "half_siblings", "text": "Do you have any half siblings (one shared parent)?"},
            {"id": "grandchildren", "text": "Do you have any grandchildren?"},
            {"id": "great_grandchildren", "text": "Do you have any great-grandchildren?"},
            {"id": "grandparents", "text": "Do you have any living grandparents?"},
            {"id": "aunts_uncles", "text": "Do you have any living aunts or uncles?"},
            {"id": "full_aunts_uncles", "text": "Do you have any full aunts or uncles (siblings of your parents)?"},
            {"id": "aunts_uncles_deceased_with_children", "text": "Are any of your aunts or uncles deceased with children of their own?"},
            {"id": "half_aunts_uncles", "text": "Do you have any half aunts or uncles (half-siblings of your parents)?"}
        ]
        
        # Create a lookup for questions by ID
        self.question_map = {q["id"]: q for q in self.questions}
        
        # Define the question flow logic
        self.question_flow = {
            "married": lambda answer: "children" if answer else "children",
            "children": lambda answer: "children_deceased" if answer else "parents_alive",
            "children_deceased": lambda answer: "deceased_children_had_children" if answer else None,
            "deceased_children_had_children": lambda answer: None,
            "parents_alive": lambda answer: None if answer else "siblings",
            "siblings": lambda answer: "full_siblings" if answer else "grandchildren",
            "full_siblings": lambda answer: "siblings_deceased_with_children" if answer else "half_siblings",
            "siblings_deceased_with_children": lambda answer: None,
            "half_siblings": lambda answer: None,
            "grandchildren": lambda answer: None if answer else "great_grandchildren",
            "great_grandchildren": lambda answer: None if answer else "grandparents",
            "grandparents": lambda answer: None if answer else "aunts_uncles",
            "aunts_uncles": lambda answer: "full_aunts_uncles" if answer else None,
            "full_aunts_uncles": lambda answer: "aunts_uncles_deceased_with_children" if answer else "half_aunts_uncles",
            "aunts_uncles_deceased_with_children": lambda answer: None,
            "half_aunts_uncles": lambda answer: None
        }

    def validate_estate_value(self, value: float) -> Tuple[bool, str]:
        """Validate the estate value input."""
        try:
            if value is None:
                return False, "Please enter your estate value"
            value = float(value)
            if value <= 0:
                return False, "Your estate value must be greater than £0"
            return True, ""
        except (ValueError, TypeError):
            return False, "Please enter a valid number"

    def format_currency(self, amount: Decimal) -> str:
        """Format amount as currency with £ symbol."""
        return f"£{amount:,.2f}"

    def calculate_distribution(self) -> str:
        """Calculate the distribution of the estate based on the current state."""
        estate_value = Decimal(str(self.state["estate_value"]))
        formatted_value = self.format_currency(estate_value)
        
        # Spouse rules
        if self.state["married"]:
            if not self.state["children"]:
                return f"Your entire estate of {formatted_value} will pass to your spouse/civil partner."
            else:
                if estate_value <= self.STATUTORY_LEGACY:
                    return f"Your entire estate of {formatted_value} will pass to your spouse/civil partner."
                remainder = estate_value - self.STATUTORY_LEGACY
                spouse_share = self.STATUTORY_LEGACY + (remainder / 2)
                children_share = remainder / 2
                
                # Improved text for per stirpes distribution
                children_text = "children" if not self.state["children_deceased"] else "living children and the children of your deceased children (who will share their parent's portion per stirpes)"
                
                return (
                    f"Your estate will be distributed as follows:\n"
                    f"• Your spouse/civil partner will receive: {self.format_currency(spouse_share)}\n"
                    f"  - First {self.format_currency(self.STATUTORY_LEGACY)} as statutory legacy\n"
                    f"  - Plus {self.format_currency(remainder / 2)} (half of the remainder)\n"
                    f"• Your {children_text} will share: {self.format_currency(children_share)}"
                )

        # Non-spouse rules in strict order of precedence
        if self.state["children"]:
            children_text = "children" if not self.state["children_deceased"] else "living children and the children of your deceased children (who will share their parent's portion per stirpes)"
            return f"Your entire estate of {formatted_value} will be divided equally between your {children_text}."

        if self.state["parents_alive"]:
            return f"Your entire estate of {formatted_value} will pass to your surviving parent(s) in equal shares."

        # Improved sibling handling with full vs half distinction
        if self.state["siblings"]:
            if self.state["full_siblings"]:
                sibling_type = "full siblings"
                children_text = " (their children will inherit their share per stirpes)" if self.state["siblings_deceased_with_children"] else ""
                return f"Your entire estate of {formatted_value} will be divided equally between your {sibling_type}{children_text}."
            elif self.state["half_siblings"]:
                return f"Your entire estate of {formatted_value} will be divided equally between your half-siblings."
        
        if self.state["grandchildren"]:
            return f"Your entire estate of {formatted_value} will be divided equally between your grandchildren."

        if self.state["great_grandchildren"]:
            return f"Your entire estate of {formatted_value} will be divided equally between your great-grandchildren."
        
        if self.state["grandparents"]:
            return f"Your entire estate of {formatted_value} will be divided equally between your grandparents."
        
        # Improved aunts/uncles handling with full vs half distinction
        if self.state["aunts_uncles"]:
            if self.state["full_aunts_uncles"]:
                aunts_text = "aunts and uncles"
                children_text = " (their children will inherit their share per stirpes)" if self.state["aunts_uncles_deceased_with_children"] else ""
                return f"Your entire estate of {formatted_value} will be divided equally between your {aunts_text}{children_text}."
            elif self.state["half_aunts_uncles"]:
                return f"Your entire estate of {formatted_value} will be divided equally between your half-aunts and half-uncles."
        
        return f"Your estate of {formatted_value} will pass to the Crown (Bona Vacantia)."

    def process_answer(self, question_id: str, answer: bool) -> Optional[str]:
        """
        Process the user's answer to a specific question and determine the next question.
        
        Args:
            question_id: The ID of the question being answered
            answer: The user's answer (True for Yes, False for No)
            
        Returns:
            The ID of the next question to ask, or None if we have enough information
        """
        # Update the state with the user's answer
        self.state[question_id] = answer
        
        # Determine the next question based on the flow logic
        if question_id in self.question_flow:
            next_question_id = self.question_flow[question_id](answer)
            return next_question_id
        
        return None

    def get_question_text(self, question_id: str) -> str:
        """Get the text for a specific question by ID."""
        if question_id in self.question_map:
            return self.question_map[question_id]["text"]
        return "Unknown question"

    def can_determine_distribution(self) -> bool:
        """Check if we have enough information to determine distribution."""
        if self.state["married"] and not self.state["children"]:
            return True
            
        if self.state["children"]:
            return (self.state["children_deceased"] is not None and 
                    (not self.state["children_deceased"] or 
                     self.state["deceased_children_had_children"] is not None))
                     
        # Check the full hierarchy
        return any([
            self.state["parents_alive"] is not None and self.state["parents_alive"],
            self.state["full_siblings"] is not None and self.state["full_siblings"],
            self.state["half_siblings"] is not None and self.state["half_siblings"],
            self.state["grandchildren"] is not None and self.state["grandchildren"],
            self.state["great_grandchildren"] is not None and self.state["great_grandchildren"],
            self.state["grandparents"] is not None and self.state["grandparents"],
            self.state["full_aunts_uncles"] is not None and self.state["full_aunts_uncles"],
            self.state["half_aunts_uncles"] is not None and self.state["half_aunts_uncles"]
        ])

def create_interface():
    calculator = IntestacyCalculator()
    
    with gr.Blocks(css="""
        .container { max-width: 800px; margin: 0 auto; }
        .question { font-size: 18px; margin-bottom: 20px; }
        .result { background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin-top: 20px; }
        footer { margin-top: 30px; font-size: 14px; color: #666; }
    """) as app:
        with gr.Column(elem_classes="container"):
            gr.Markdown("# UK Intestacy Calculator")
            gr.Markdown("Find out how your estate would be distributed if you die without a will")
            
            # State tracking
            state = gr.State({
                "current_step": "name",
                "question_id": None,
                "name": "",
                "estate_value": None,
                "contact_info": "Please contact us on 0161 xxx xxxx to discuss creating a Will."
            })
            
            # Define components
            name_input = gr.Textbox(label="What is your name?", placeholder="Enter your full name", visible=True)
            estate_input = gr.Number(label="What is the approximate value of your estate (£)?", visible=False)
            status_input = gr.Radio(
                choices=["Single", "Married/Civil Partnership", "Divorced", "Widowed"],
                label="What is your relationship status?",
                visible=False
            )
            yes_no = gr.Radio(choices=["Yes", "No"], label="Your Answer", visible=False)
            
            # Improved result display with better formatting
            with gr.Box(visible=False) as result_box:
                result = gr.Markdown(elem_classes="result")
                gr.Markdown("""
                    ## What Next?
                    Having a proper Will is the only way to ensure your estate is distributed according to your wishes.
                """)
                contact_info = gr.Markdown(elem_id="contact_info")
            
            def on_submit(*args):
                """Handle Enter key press on inputs"""
                value = args[0] if args else None
                state_value = args[1] if len(args) > 1 else None
                return update_interface(value, None, None, None, state_value)
            
            # Add submit handlers 
            name_input.submit(
                fn=on_submit,
                inputs=[name_input, state],
                outputs=[name_input, estate_input, status_input, yes_no, result_box, result, contact_info, state]
            )
            
            estate_input.submit(
                fn=on_submit,
                inputs=[estate_input, state],
                outputs=[name_input, estate_input, status_input, yes_no, result_box, result, contact_info, state]
            )
            
            def update_interface(name, estate, status, answer, current_state):
                current_state = current_state or {"current_step": "name", "question_id": None, "name": "", "estate_value": None}
                
                # Base updates dictionary
                updates = {
                    name_input: gr.update(visible=False),
                    estate_input: gr.update(visible=False),
                    status_input: gr.update(visible=False),
                    yes_no: gr.update(visible=False),
                    result_box: gr.update(visible=False),
                    result: gr.update(value=""),
                    contact_info: gr.update(value=current_state.get("contact_info", "")),
                    state: current_state
                }

                # Name input handling
                if current_state["current_step"] == "name" and name:
                    current_state["name"] = name
                    current_state["current_step"] = "estate"
                    updates[estate_input] = gr.update(visible=True)
                    return updates
                    
                # Estate value handling with validation
                if current_state["current_step"] == "estate" and estate is not None:
                    valid, error = calculator.validate_estate_value(estate)
                    if not valid:
                        updates[estate_input] = gr.update(visible=True, error_text=error)
                        return updates
                    current_state["estate_value"] = estate
                    current_state["current_step"] = "status"
                    updates[status_input] = gr.update(visible=True)
                    return updates
                    
                # Status handling
                if current_state["current_step"] == "status" and status:
                    calculator.state.update({
                        "name": current_state["name"],
                        "estate_value": current_state["estate_value"],
                        "married": (status == "Married/Civil Partnership")
                    })
                    
                    # Start the question flow
                    current_state["current_step"] = "question"
                    current_state["question_id"] = "children"
                    updates[yes_no] = gr.update(
                        visible=True, 
                        label=calculator.get_question_text("children")
                    )
                    return updates

                # Question flow handling
                if current_state["current_step"] == "question" and answer is not None:
                    question_id = current_state["question_id"]
                    is_yes = (answer == "Yes")
                    
                    # Update the calculator state with this answer
                    calculator.state[question_id] = is_yes
                    
                    # Process the answer and get the next question
                    next_question_id = calculator.process_answer(question_id, is_yes)
                    
                    # If we have a next question, show it
                    if next_question_id:
                        current_state["question_id"] = next_question_id
                        updates[yes_no] = gr.update(
                            visible=True, 
                            label=calculator.get_question_text(next_question_id)
                        )
                        return updates
                    
                    # Otherwise, we have enough information to show the result
                    result_text = calculator.calculate_distribution()
                    result_text = f"## Distribution Results for {current_state['name']}\n\n{result_text}\n\nIf you wish to change this distribution, you will need to create a Will."
                    
                    updates[result_box] = gr.update(visible=True)
                    updates[result] = gr.update(value=result_text)
                    return updates

                # If we reach here with no matched condition, keep current state
                return updates

            next_button = gr.Button("Continue")
            next_button.click(
                fn=update_interface,
                inputs=[name_input, estate_input, status_input, yes_no, state],
                outputs=[name_input, estate_input, status_input, yes_no, result_box, result, contact_info, state]
            )
            
            # Add restart button
            restart_button = gr.Button("Start Again")
            def restart():
                calculator.__init__()  # Reset calculator
                new_state = {
                    "current_step": "name",
                    "question_id": None,
                    "name": "",
                    "estate_value": None,
                    "contact_info": "Please contact us on 0161 xxx xxxx to discuss creating a Will."
                }
                return [
                    gr.update(visible=True, value=""),  # name_input
                    gr.update(visible=False, value=None),  # estate_input
                    gr.update(visible=False, value=None),  # status_input
                    gr.update(visible=False, value=None),  # yes_no
                    gr.update(visible=False),  # result_box
                    gr.update(value=""),  # result
                    gr.update(value=new_state["contact_info"]),  # contact_info
                    new_state  # state
                ]
                
            restart_button.click(
                fn=restart,
                inputs=[],
                outputs=[name_input, estate_input, status_input, yes_no, result_box, result, contact_info, state]
            )
            
            # Footer with disclaimer
            gr.Markdown("""
            <footer>
            <strong>Legal Disclaimer:</strong> This calculator provides guidance based on UK intestacy rules. 
            For legal advice, please consult a qualified professional.
            </footer>
            """)
    
    return app

if __name__ == "__main__":
    app = create_interface()
    app.launch(
        share=True,  # Enable public link
        inbrowser=True  # Open in browser automatically
    )