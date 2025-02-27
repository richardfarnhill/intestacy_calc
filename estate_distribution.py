import gradio as gr

def determine_estate_distribution(marital_status, has_children, has_grandchildren, has_greatgrandchildren, parents_alive, has_siblings, has_half_siblings, grandparents_alive, num_grandparents, aunts_uncles_alive, num_aunts_uncles, half_aunts_uncles_alive, num_half_aunts_uncles, estate_value, num_children=0, num_grandchildren=0, num_greatgrandchildren=0, num_siblings=0, num_half_siblings=0):
    estate_value = float(estate_value)
    if marital_status == "Married":
        if has_children == "Yes":
            num_children = int(num_children)
            if estate_value <= 322000:
                distribution = f"Spouse gets the entire estate: £{estate_value:.2f}"
            else:
                spouse_initial_share = 322000.0
                remaining_estate = estate_value - spouse_initial_share
                spouse_share = spouse_initial_share + (remaining_estate / 2)
                children_share = remaining_estate / 2
                per_child_share = children_share / num_children
                distribution = f"Spouse gets £322,000 plus half of the remaining estate: £{spouse_share:.2f}. The remaining half (£{children_share:.2f}) is split equally between {num_children} children, each receiving £{per_child_share:.2f}."
        else:
            distribution = f"Spouse gets the entire estate: £{estate_value:.2f}"
    elif marital_status in ["Single", "Divorced", "Widowed"]:
        if has_children == "Yes":
            num_children = int(num_children)
            per_child_share = estate_value / num_children
            distribution = f"The estate is split equally between {num_children} children, each receiving £{per_child_share:.2f}."
        else:
            if has_grandchildren == "Yes":
                num_grandchildren = int(num_grandchildren)
                per_grandchild_share = estate_value / num_grandchildren
                distribution = f"The estate is split equally between {num_grandchildren} grandchildren, each receiving £{per_grandchild_share:.2f}."
            elif has_greatgrandchildren == "Yes":
                num_greatgrandchildren = int(num_greatgrandchildren)
                per_greatgrandchild_share = estate_value / num_greatgrandchildren
                distribution = f"The estate is split equally between {num_greatgrandchildren} great-grandchildren, each receiving £{per_greatgrandchild_share:.2f}."
            elif parents_alive == "Yes":
                distribution = f"The entire estate goes to the parents: £{estate_value:.2f}"
            elif has_siblings == "Yes":
                num_siblings = int(num_siblings)
                per_sibling_share = estate_value / num_siblings
                distribution = f"The estate is split equally between {num_siblings} siblings, each receiving £{per_sibling_share:.2f}."
            elif has_half_siblings == "Yes":
                num_half_siblings = int(num_half_siblings)
                per_half_sibling_share = estate_value / num_half_siblings
                distribution = f"The estate is split equally between {num_half_siblings} half-siblings, each receiving £{per_half_sibling_share:.2f}."
            elif grandparents_alive == "Yes":
                num_grandparents = int(num_grandparents)
                per_grandparent_share = estate_value / num_grandparents
                distribution = f"The estate is split equally between {num_grandparents} grandparents, each receiving £{per_grandparent_share:.2f}."
            elif aunts_uncles_alive == "Yes":
                num_aunts_uncles = int(num_aunts_uncles)
                per_aunt_uncle_share = estate_value / num_aunts_uncles
                distribution = f"The estate is split equally between {num_aunts_uncles} aunts and uncles, each receiving £{per_aunt_uncle_share:.2f}."
            elif half_aunts_uncles_alive == "Yes":
                num_half_aunts_uncles = int(num_half_aunts_uncles)
                per_half_aunt_uncle_share = estate_value / num_half_aunts_uncles
                distribution = f"The estate is split equally between {num_half_aunts_uncles} half-aunts and half-uncles, each receiving £{per_half_aunt_uncle_share:.2f}."
            else:
                distribution = "The estate goes to the Crown (Bona Vacantia)."
    else:
        distribution = "The estate goes to the Crown (Bona Vacantia)."

    return distribution

with gr.Blocks() as demo:
    marital_status = gr.Radio(["Married", "Single", "Divorced", "Widowed"], label="Marital Status")
    has_children = gr.Radio(["Yes", "No"], label="Do you have children?")
    estate_value = gr.Number(label="Estate Value")
    num_children = gr.Number(value=0, label="Number of Children (if applicable)", visible=False)
    has_grandchildren = gr.Radio(["Yes", "No"], label="Do you have grandchildren?", visible=False)
    num_grandchildren = gr.Number(value=0, label="Number of Grandchildren", visible=False)
    has_greatgrandchildren = gr.Radio(["Yes", "No"], label="Do you have great-grandchildren?", visible=False)
    num_greatgrandchildren = gr.Number(value=0, label="Number of Great-Grandchildren", visible=False)
    parents_alive = gr.Radio(["Yes", "No"], label="Are parents alive?", visible=False)
    has_siblings = gr.Radio(["Yes", "No"], label="Do you have siblings?", visible=False)
    num_siblings = gr.Number(value=0, label="Number of Siblings", visible=False)
    has_half_siblings = gr.Radio(["Yes", "No"], label="Do you have half-siblings?", visible=False)
    num_half_siblings = gr.Number(value=0, label="Number of Half-Siblings", visible=False)

    grandparents_alive = gr.Radio(["Yes", "No"], label="Are grandparents alive?", visible=False)
    num_grandparents = gr.Number(value=0, label="Number of Grandparents", visible=False)
    aunts_uncles_alive = gr.Radio(["Yes", "No"], label="Are aunts or uncles alive?", visible=False)
    num_aunts_uncles = gr.Number(value=0, label="Number of Aunts/Uncles", visible=False)
    half_aunts_uncles_alive = gr.Radio(["Yes", "No"], label="Are half-aunts or half-uncles alive?", visible=False)
    num_half_aunts_uncles = gr.Number(value=0, label="Number of Half-Aunts/Uncles", visible=False)

    output = gr.Textbox(label="Estate Distribution", visible=False)  # Hidden initially
    submit_btn = gr.Button("Submit", visible=False) #Hidden initially

    def show_number_if_yes(radio_value):
        if radio_value == "Yes":
            return gr.update(visible=True)
        else:
            return gr.update(visible=False)

    def show_next_questions(marital_status_value, has_children_value):
        """Controls initial question visibility."""
        if marital_status_value in ["Single", "Divorced", "Widowed"] and has_children_value == "No":
            return  gr.update(visible=False), gr.update(visible=True),  gr.update(visible=False), gr.update(visible=False), gr.update(visible=False),  gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False) # NO OUTPUT or SUBMIT - force hidden - ALSO SUBMIT

        elif has_children_value == "Yes":
            return  gr.update(visible=True), gr.update(visible=False),  gr.update(visible=False), gr.update(visible=False), gr.update(visible=False),  gr.update(visible=False), gr.update(visible=False), gr.update(visible=False),  gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=True), gr.update(visible=True) # SHOW SUBMIT and OUTPUT

        else:  # All other scenarios - i.e. Married, No children - Show Output/Submit immediately as Spouse inherits all
            return  gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False),  gr.update(visible=False), gr.update(visible=False), gr.update(visible=False),  gr.update(visible=False), gr.update(visible=False), gr.update(visible=False),  gr.update(visible=True),  gr.update(visible=True) #SHOW SUBMIT and  OUTPUT


    def show_greatgrandchildren(has_grandchildren_value):
        return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False) , gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False) # NO OUTPUT or SUBMIT - force hidden

    def show_parents(has_greatgrandchildren_value):
        return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False) # NO OUTPUT or SUBMIT - force hidden

    def show_siblings(parents_alive_value):
        return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False) # NO OUTPUT or SUBMIT - force hidden

    def show_half_siblings(siblings_value):
        return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False) # NO OUTPUT or SUBMIT - force hidden

    def show_grandparents(half_siblings_value):
        return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False) # NO OUTPUT or SUBMIT - force hidden

    def show_aunts_uncles(grandparents_value):
        return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False) # NO OUTPUT or SUBMIT - force hidden

    def show_half_aunts_uncles(aunts_uncles_value):
        return gr.update(visible=True), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False), gr.update(visible=False) # NO OUTPUT or SUBMIT - force hidden

    # Link the 'Yes/No' Radio Buttons to their respective Number inputs
    has_children.change(show_number_if_yes, inputs=has_children, outputs=num_children)
    has_grandchildren.change(show_number_if_yes, inputs=has_grandchildren, outputs=num_grandchildren)
    has_greatgrandchildren.change(show_number_if_yes, inputs=has_greatgrandchildren, outputs=num_greatgrandchildren)
    has_siblings.change(show_number_if_yes, inputs=has_siblings, outputs=num_siblings)
    has_half_siblings.change(show_number_if_yes, inputs=has_half_siblings, outputs=num_half_siblings)
    grandparents_alive.change(show_number_if_yes, inputs=grandparents_alive, outputs=num_grandparents)
    aunts_uncles_alive.change(show_number_if_yes, inputs=aunts_uncles_alive, outputs=num_aunts_uncles)
    half_aunts_uncles_alive.change(show_number_if_yes, inputs=half_aunts_uncles_alive, outputs=num_half_aunts_uncles)

    marital_status.change(show_next_questions, inputs=[marital_status, has_children], outputs=[num_children, has_grandchildren, has_greatgrandchildren, parents_alive, has_siblings, has_half_siblings, grandparents_alive, aunts_uncles_alive, half_aunts_uncles_alive, num_aunts_uncles, num_half_aunts_uncles, output, submit_btn])
    has_children.change(show_next_questions, inputs=[marital_status, has_children], outputs=[num_children, has_grandchildren, has_greatgrandchildren, parents_alive, has_siblings, has_half_siblings, grandparents_alive, aunts_uncles_alive, half_aunts_uncles_alive, num_aunts_uncles, num_half_aunts_uncles,output, submit_btn])

    has_grandchildren.change(show_greatgrandchildren, inputs = has_grandchildren, outputs=[has_greatgrandchildren, num_grandchildren, parents_alive, has_siblings, output, submit_btn])
    has_greatgrandchildren.change(show_parents, inputs=has_greatgrandchildren, outputs=[parents_alive, has_siblings, num_siblings, output, submit_btn])
    parents_alive.change(show_siblings, inputs=parents_alive, outputs=[has_siblings, num_siblings, has_half_siblings, num_half_siblings, output, submit_btn])
    has_siblings.change(show_half_siblings, inputs=has_siblings, outputs=[has_half_siblings, num_half_siblings, grandparents_alive, num_grandparents, aunts_uncles_alive, output, submit_btn])
    has_half_siblings.change(show_grandparents, inputs=has_half_siblings, outputs=[grandparents_alive, num_grandparents, aunts_uncles_alive, num_aunts_uncles, output, submit_btn])
    grandparents_alive.change(show_aunts_uncles, inputs=grandparents_alive, outputs=[aunts_uncles_alive, num_aunts_uncles, half_aunts_uncles_alive, num_half_aunts_uncles, output, submit_btn])
    aunts_uncles_alive.change(show_half_aunts_uncles, inputs=aunts_uncles_alive, outputs=[half_aunts_uncles_alive, num_half_aunts_uncles, output, submit_btn])

    def get_distribution(marital_status, has_children, has_grandchildren, has_greatgrandchildren, parents_alive, has_siblings, has_half_siblings, grandparents_alive, num_grandparents, aunts_uncles_alive, num_aunts_uncles, half_aunts_uncles_alive, num_half_aunts_uncles, estate_value, num_children=0, num_grandchildren=0, num_greatgrandchildren=0, num_siblings=0, num_half_siblings=0):
        #Only run if the estate goes to the Crown (Bona Vacantia)
        if (marital_status in ["Single", "Divorced", "Widowed"] and has_children == "No" and has_grandchildren == "No" and has_greatgrandchildren == "No" and parents_alive == "No" and has_siblings == "No" and has_half_siblings == "No" and grandparents_alive == "No" and aunts_uncles_alive == "No" and half_aunts_uncles_alive == "No"):
            return gr.update(value="The estate goes to the Crown (Bona Vacantia).", visible=True)
        else: #Otherwise, run it only when it goes to spouses/children
            return gr.update(value = determine_estate_distribution(marital_status, has_children, has_grandchildren, has_greatgrandchildren, parents_alive, has_siblings, has_half_siblings, grandparents_alive, num_grandparents, aunts_uncles_alive, num_aunts_uncles, half_aunts_uncles_alive, num_half_aunts_uncles, estate_value, num_children, num_grandchildren, num_greatgrandchildren, num_siblings, num_half_siblings), visible=True)


    submit_btn.click(
        get_distribution,
        inputs=[
            marital_status,
            has_children,
            has_grandchildren,
            has_greatgrandchildren,
            parents_alive,
            has_siblings,
            has_half_siblings,
            grandparents_alive,
            num_grandparents,
            aunts_uncles_alive,
            num_aunts_uncles,
            half_aunts_uncles_alive,
            num_half_aunts_uncles,
            estate_value,
            num_children,
            num_grandchildren,
            num_greatgrandchildren,
            num_siblings,
            num_half_siblings
        ],
        outputs=output
    )
demo.launch(show_error=True)
